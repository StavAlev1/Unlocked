<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class UserApprovalController extends Controller
{
    /**
     * Approve the user, so their rooms can appear on the public site.
     */
    public function store(User $user): RedirectResponse
    {
        $user->approve();

        Inertia::flash('toast', ['type' => 'success', 'message' => __(':name approved.', ['name' => $user->name])]);

        return back();
    }

    /**
     * Withdraw the user's approval, hiding their rooms from the public site.
     * Existing bookings stay valid and reachable through their own links.
     */
    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->is_admin, 403, 'Administrators are always approved.');

        $user->revokeApproval();

        Inertia::flash('toast', ['type' => 'success', 'message' => __(':name is no longer approved.', ['name' => $user->name])]);

        return back();
    }
}
