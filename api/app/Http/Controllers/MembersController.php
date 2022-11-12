<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\HttpResponse;
use App\Http\Requests\MemberUpdateRequest;
use App\Models\User;
use Carbon\Carbon;

class MembersController extends Controller
{
    use HttpResponse;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $members = User::with('company:user_id,customer_code')->get();

            return $this->sendResponse($members, 'Members list');
        } catch (Throwable $th) {
            return $this->sendError($th);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        try {
            $member = User::find($id, ['id','fname', 'lname','email','email_verified_at', 'active']);

            if ($member) {
                $member = array_merge($member->toArray(), [ 'customer_code' => $member->company->customer_code ?? '']);
            }

            return $this->sendResponse($member, 'get member details');
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
    public function update(MemberUpdateRequest $request, $id)
    {
        try {
            $request->validated($request->all());

            $member = User::find($id);
            $member->fname = $request->fname;
            $member->lname = $request->lname;
            $member->email = $request->email;
            $member->active = strval($request->is_active);

            // Include column verify
            if ($request->is_verify && !$request->email_verified_at) {
                $member->email_verified_at = Carbon::now();
            }
            $member->save();

            return $this->sendResponse($member, 'successfully update member details');
        } catch (Throwable $th) {
            return $this->sendError($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
