<?php

use App\Http\Controllers\Admin\UserApprovalController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', UserController::class)->except('show');

        Route::post('users/{user}/approval', [UserApprovalController::class, 'store'])->name('users.approval.store');
        Route::delete('users/{user}/approval', [UserApprovalController::class, 'destroy'])->name('users.approval.destroy');
    });
