import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.LoginComponent)
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/layout/admin-layout/admin-layout').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard-admin/dashboard-admin').then(
            (m) => m.DashboardAdmin
          )
      },
      {
        path: 'manage-posts',
        loadComponent: () =>
          import('./features/admin/manage-posts/manage-posts').then(
            (m) => m.ManagePosts
          )
      },
      {
        path: 'manage-users',
        loadComponent: () =>
          import('./features/admin/manage-users/manage-users').then(
            (m) => m.ManageUsers
          )
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: '',
    loadComponent: () =>
      import('./features/user/layout/user-layout/user-layout').then(
        (m) => m.UserLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/user/dashboard/dashboard').then((m) => m.Dashboard)
      },
      {
        path: 'posts-nintendo-switch-2',
        loadComponent: () =>
          import('./features/user/posts-nintendo-switch-2/posts-nintendo-switch-2').then(
            (m) => m.PostsNintendoSwitch2
          )
      },
      {
        path: 'posts-nintendo-switch',
        loadComponent: () =>
          import('./features/user/posts-nintendo-switch/posts-nintendo-switch').then(
            (m) => m.PostsNintendoSwitch
          )
      },
      {
        path: 'posts-wii-u',
        loadComponent: () =>
          import('./features/user/posts-wii-u/posts-wii-u').then((m) => m.PostsWiiU)
      },
      {
        path: 'posts-retro',
        loadComponent: () =>
          import('./features/user/posts-retro/posts-retro').then((m) => m.PostsRetro)
      },
      {
        path: 'terms-of-use',
        loadComponent: () =>
          import('./features/user/terms-of-use/terms-of-use').then(
            (m) => m.TermsOfUseComponent
          )
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];