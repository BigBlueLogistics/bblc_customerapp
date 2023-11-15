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

            $members = User::with('company:user_id,customer_code')->get();

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
    public function edit(User $user, $id)
    {
        try {
            $this->authorize('view', $user);

            $member = User::find($id, ['id', 'fname', 'lname', 'email', 'email_verified_at', 'active', 
                    'role_id', 'van_status','invnt_report' , 'phone_num'
            ]);
            $roles = Role::where('id', '!=', 0)->select('id','name')->get();
            $rolesWithNone = array_merge([[ 'id' => '', 'name' => '--None--']], $roles->toArray());

            if ($member) {
                $vanStatus = $member->van_status == 'x';
                $invntReport = $member->invnt_report == 'x';
                $isActive = $member->active;
                $member = array_merge([...$member->toArray(), 
                        'van_status' => $vanStatus, 
                        'invnt_report' => $invntReport,
                        'active' => $isActive,
                    ], 
                    [
                        'customer_code' => $member->company->customer_code ?? '',
                        'company' => $member->company->company ?? '',
                        'roles' => $rolesWithNone
                    ]
                );
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
    public function update(User $user, MemberUpdateRequest $request, $id)
    {
        try {
            $this->authorize('update', $user);

            $request->validated($request->all());

            $member = User::find($id);
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

            // Update customer code and company if user exist else not insert the record.
            if ($isSuccess) {
                $currentCompanyName = $member->company ? $member->company->company : null;
                $companyDetails = CompanyRepresent::updateOrCreate(
                    ['user_id' => $id, 'company' => $currentCompanyName],
                    ['customer_code' => $request->customer_code, 'company' => $request->company_name]
                );

                $roles = Role::where('id', '!=', 0)->select('id','name')->get();
                $rolesWithNone = array_merge([[ 'id' => '', 'name' => '--None--']], $roles->toArray());

                $vanStatus = $member->van_status == 'x';
                $invntReport = $member->invnt_report == 'x';
                $member = array_merge([...$member->toArray(), 
                    'van_status' => $vanStatus, 
                    'invnt_report' => $invntReport,
                ],[
                    'customer_code' => $companyDetails->customer_code ?? '',
                    'company' => $companyDetails->company ?? '',
                    'roles' => $rolesWithNone
                ]);

                // insert inventory report
                $invntReport = $this->members->createInventoryReport($request->all());
                $member['invnt_report_message'] = $invntReport;
                
            }

            return $this->sendResponse($member, __('members.updated'));
        } catch (Throwable $th) {
            return $this->sendError($th);
        }
    }
}
