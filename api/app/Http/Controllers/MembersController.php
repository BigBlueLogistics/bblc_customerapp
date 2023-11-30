<?php

namespace App\Http\Controllers;

use App\Interfaces\IMemberRepository;
use App\Http\Requests\MemberUpdateRequest;
use App\Models\CompanyRepresent;
use App\Models\User;
use App\Models\Role;
use App\Traits\HttpResponse;
use Carbon\Carbon;

class MembersController extends Controller
{
    use HttpResponse;

    private $members;

    public function __construct(IMemberRepository $members) {
        $this->members = $members;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(User $user)
    {
        try {
            $this->authorize('view', $user);

            $members = User::with('company:user_id,customer_code')
                        ->orderBy('active','asc')
                        ->orderBy('email_verified_at','desc')
                        ->get();

            return $this->sendResponse($members, 'members list');
        } catch (Throwable $th) {
            return $this->sendError($th);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user, $loggedUserId)
    {
        try {
            $this->authorize('view', $user);

            $member = User::find($loggedUserId, ['id', 'fname', 'lname', 'email', 'email_verified_at', 'active', 
                    'role_id', 'van_status','invnt_report' , 'phone_num'
            ]);
            $roles = Role::where('id', '!=', 0)->select('id','name')->get();
            $rolesWithNone = [['id' => '', 'name' => '--None--'], ...$roles->toArray()];

            if ($member) {
                $vanStatus = $member->van_status == 'x';
                $invntReport = $member->invnt_report == 'x';
                $isActive = $member->active;
                $companies = collect($member->companies)->map(function($item){
                    return $item->only(['id','customer_code','company']);
                })->all();

                $member = [...$member->toArray(), 
                        'van_status' => $vanStatus, 
                        'invnt_report' => $invntReport,
                        'active' => $isActive,
                        'companies' => $companies,
                        'customer_code' => $member->company->customer_code ?? '',
                        'company' => $member->company->company ?? '',
                        'roles' => $rolesWithNone
                    ];
              
            }

            return $this->sendResponse($member, 'member details');
        } catch (Throwable $th) {
            return $this->sendError($th);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(User $user, MemberUpdateRequest $request, $loggedUserId)
    {
        try {
            $this->authorize('update', $user);

            $request->validated($request->all());

            $member = User::find($loggedUserId);
            $member->fname = $request->fname;
            $member->lname = $request->lname;
            $member->email = $request->email;
            $member->phone_num = $request->phone_num;
            $member->role_id = $request->role_id;
            $member->active = $request->is_active ? 'true' : 'false';
            $member->van_status = $request->van_status ? 'x' : null;
            $member->invnt_report = $request->invnt_report ? 'x' : null;

            // Include column verify
            if ($request->is_verify) {
                $member->email_verified_at = Carbon::now();
            }
            $isSuccess = $member->save();

            // If user existed, update the field customer code and company name
            // else not insert the record.
            if ($isSuccess) {
                foreach ($request->companies as $value) {
                    CompanyRepresent::updateOrCreate(
                        ['id' => $value['id'], 'user_id' => $loggedUserId],
                        ['customer_code' => $value['customer_code'], 'company' => $value['company']]
                    );
                }

                // Delete assigned companies
                if($request->delete_companies){
                    CompanyRepresent::where('user_id', $loggedUserId)
                        ->whereIn('id', $request->delete_companies)
                        ->delete();
                }

                $roles = Role::where('id', '!=', 0)->select('id','name')->get();
                $rolesWithNone = [['id' => '', 'name' => '--None--'], ...$roles->toArray()];

                $vanStatus = $member->van_status == 'x';
                $invntReport = $member->invnt_report == 'x';
                $newCompanies = CompanyRepresent::where('user_id', $loggedUserId)->get(['id','customer_code','company']);

                $member = [...$member->toArray(), 
                    'van_status' => $vanStatus, 
                    'invnt_report' => $invntReport,
                    'companies' => $newCompanies,
                    'roles' => $rolesWithNone,
                ];

                // TODO: incorporate the multiple custome code
                // // insert inventory report
                // $invntReport = $this->members->createInventoryReport($request->all());
                // $member['invnt_report_message'] = $invntReport;
                
            }

            return $this->sendResponse($member, __('members.updated'));
        } catch (Throwable $th) {
            return $this->sendError($th);
        }
    }
}
