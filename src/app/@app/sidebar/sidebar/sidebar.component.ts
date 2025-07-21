import { Component, inject, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { EmrNavigationModule, HDividerComponent } from '@elementar/components';
import { MatRipple } from '@angular/material/core';
import { OrderByPipe } from '@elementar/components';
import { ToolbarComponent } from '@app/sidebar/_toolbar/toolbar.component';
import { PermissionService } from '../../../services/authentication/permission.service';

export interface NavItem {
  type: string;
  name: string;
  icon?: string;
  id?: string | number;
  link?: string;
  children?: NavItem[];
  permission: string | string[];  // Add this line to include the permission property

}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    EmrNavigationModule,
    MatRipple,
    ToolbarComponent,
    OrderByPipe,
    HDividerComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  host: {
    'class': 'sidebar'
  }
})
export class SidebarComponent {
  router = inject(Router);
  location = inject(Location);
  height: string | null = '200px';

  @ViewChild('navigation', { static: true })
  navigation!: any;

  navItems: NavItem[] = [
     {
      id: 'dashboard',
      type: 'Single',  // Changed from 'group' to 'link'
      name: 'Dashboard',
      icon: 'dashboard',
      permission: 'View Dashboard',
      link: '/pages/dashboard/basic'
    },

    {
      id: 'dashboard1',
      type: 'Single',  // Changed from 'group' to 'link'
      name: 'Dashboard',
      icon: 'dashboard',
      permission: 'View Referral Dashboard',
      link: '/pages/dashboard/finance'
    },



    // {
    //   id: 'dashboard',
    //   type: 'group',
    //   name: 'Dashboard',
    //   icon: 'dashboard',
    //   permission: 'View Dashboard',
    //   children: [
    //     {
    //       type: 'link',
    //       name: 'Dashboard',
    //       link: '/pages/dashboard',
    //       permission: 'View Dashboard',

    //     }
    //   ]
    // },

    {
      id: 'users',
      type: 'group',
      name: 'Config Users & Audit',
      icon: 'person',
      permission: ['View User', 'View Permission', 'View Role'],
      children: [

        {
          type: 'link',
          name: 'Manage Users',
          link: '/pages/users',
          permission: 'View User',

        },
        {
          type: 'link',
          name: 'Manage Roles',
          link: '/pages/users/role-permission',
          permission: 'View Role',

        },
        {
          type: 'link',
          name: 'Permission',
          link: '/pages/users/permission',
          permission: 'View Permission',

        },
      ]
    },
    {
      id: 'configid',
      type: 'group',
      icon: 'settings',
      name: 'System Configuration',
      permission: 'Setup Management',
      children: [
        // {
        //   type: 'link',
        //   name: 'View Country',
        //   link: '/pages/config/country',
        //   permission: 'Setup Management',

        // },
        {
          type: 'link',
          name: 'Location',
          link: '/pages/config/location',
          permission: 'Setup Management',
        },
        // {
        //   type: 'link',
        //   name: 'Employer',
        //   link: '/pages/config/employer',
        //   permission: 'Setup Management',
        // },
        // {
        //   type: 'link',
        //   name: 'Work Station',
        //   link: '/pages/config/work-station',
        //   permission: 'Setup Management',
        // },
        // {
        //   type: 'link',
        //   name: 'Employer Type',
        //   link: '/pages/config/employer-type',
        //   permission: 'View Employer Type',
        // },
        {
          type: 'link',
          name: 'Hospital',
          link: '/pages/config/hospital',
          permission: 'View Hospital',

        },


        {
          type: 'link',
          name: 'Referral Type',
          link: '/pages/config/referal-type',
          permission: 'View ReferralType',

        },


        {
          type: 'link',
          name: 'Reason',
          link: '/pages/config/reasons',
          permission: 'View Reason',
        }
      ]
    },

    {
      id: 'PID',
      type: 'group',
      name: 'Patient',
      icon: 'menu',
      permission: 'View Patient',
      children: [
        {
          type: 'link',
          name: 'Patient',
          link: '/pages/patient',
          permission: 'View Patient',

        },
         {
          type: 'link',
          name: 'Insurances',
          link: '/pages/patient/insurances0000011111',
          permission: 'View Patient',

        }
      ]
    },
    {
      id: 'referral',
      type: 'group',
      name: 'Referral Management',
      icon: 'call_split',
      permission: 'View Referral',
      children: [
        {
          type: 'link',
          name: 'View referral',
          link: '/pages/config/referrals',
          permission: 'View Referral',
        },
        {
          type: 'link',
          name: 'Confirmed Referral',
          link: '/pages/config/referrals/confirm0000111101',
          permission: 'View Referral',
        },



        //  {
        //   type: 'link',
        //   name: 'Range Report',
        //  link: '/pages/config/referrals/referralreport0990',

        //   permission: 'View Monthly Bill',

        // }
      ]
    },
    {
           id: 'bills',
           type: 'Single',
          name: 'View Bill',
          icon:'bill',
          link: '/pages/config/referrals/bill',
          permission: 'View Referral',

        },
         {
          id: 'payment',
          type: 'Single',
          name: 'Payment',
          icon:'payment',
          link: '/pages/config/referrals/billpayment2222200000',
          permission: 'View Referral',

        },
         {
          id: 'months1',
          type: 'Single',
          name: 'Month Bill',
          icon:'month',
          link: '/pages/config/referrals/monthbill00998778',
          permission: 'View Monthly Bill',

        },
     {
      id: 'report3',
      type: 'Single',  // Changed from 'group' to 'link'
      name: 'Range Report',
      icon: 'report',
      permission: 'View Monthly Bill',
      link: '/pages/patient/referralreport0990',

    },
     {
      id: 'report4',
      type: 'Single',  // Changed from 'group' to 'link'
      name: 'Search Report',
      icon: 'search',
      permission: 'View Monthly Bill',
      link: '/pages/patient/searchreport99990000',

    },





    {
      id: 'accountant',
      type: 'group',
      name: 'Accountant Setup',
      icon: 'menu',
      // permission: 'Accountant Module',
      permission: 'Accountant Module',
      children: [
        {
          type: 'link',
          name: 'Sources',
          link: '/pages/accounts/source',
          permission: 'Accountant Module',

        },
        {
          type: 'link',
          name: 'Source Type',
          link: '/pages/accounts/sourceType',
          permission: 'Accountant Module',

        },
        {
          type: 'link',
          name: 'Category',
          link: '/pages/accounts/category',
          permission: 'Accountant Module',

        },
        {
          type: 'link',
          name: 'Document Type',
          link: '/pages/accounts/documentCategory',
          permission: 'Accountant Module',

        },

      ]
    },

     {
      id: 'dodument1',
      type: 'Single',  // Changed from 'group' to 'link'
      name: 'Document',
      icon: 'document',
      permission: 'View Document Form',
      link: '/pages/accounts/documentForm',
    },

    {
      id: 'report2',
      type: 'group',
      name: 'Report',
      icon: 'report',
      permission: 'View Report',
      children: [

        {
          type: 'link',
          name: 'Range Report',
          link: '/pages/accounts/report',
          permission: 'View Report',

        },
        {
          type: 'link',
          name: 'Search Report',
          link: '/pages/accounts/parameter-report',
          permission: 'View Report',

        },
      ]
    },

  ];
  navItemLinks: NavItem[] = [];
  activeLinkId: any = '/';

  constructor(public permission: PermissionService) {}

  ngOnInit() {
    this.navItems.forEach((navItem) => {
      this.navItemLinks.push(navItem);

      if (navItem.children) {
        this.navItemLinks = this.navItemLinks.concat(
          navItem.children as NavItem[]
        );
        this.updateMenu();
      }
    });
    this._activateLink();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this._activateLink();
        this.updateMenu();
      });
  }

  private _activateLink() {
    const activeLink = this.navItemLinks.find(
      (navItem) => navItem.link === this.location.path()
    );

    if (activeLink) {
      this.activeLinkId = activeLink.link;
    } else {
      this.activeLinkId = null;
    }
  }


  //====================================== code zangu mwanzo hapa ============================

  // Function to check if the user has permission for a specific action
  hasPermission(action: string | string[]): boolean {
    if (Array.isArray(action)) {
      // If it's an array, check if the user has permission for at least one action
      return action.some((permission) =>
        this.permission.parmissionMatched([permission.trim()])
      );
    } else {
      // If it's a string, check if the user has permission for that action
      return this.permission.parmissionMatched([action.trim()]);
    }
  }

  // Function to filter out menu items based on permissions
  filterMenuByPermissions(menu: Array<NavItem>): Array<NavItem> {
    return menu
      .map((group) => {
        // Check if the group itself has a permission and if it's valid
        if (group.permission && !this.hasPermission(group.permission)) {
          // If the group's permission is not met, exclude it entirely
          return null;
        }

        return {
          ...group,
          children: group.children
            ? this.filterChildrenByPermissions(group.children)
            : [],
        };
      })
      .filter(
        (group) => group !== null && group.id !== null
      ) as NavItem[];
  }

  // Recursive function to filter children based on permissions
  filterChildrenByPermissions(children: Array<NavItem>): Array<NavItem> {
    return children
      .map((item) => ({
        ...item,
        children: item.children
          ? this.filterChildrenByPermissions(item.children)
          : [],
      }))
      .filter((item) => {
        if (!item.permission) {
          // If the menu item does not have a permission specified, include it in the filtered menu
          return true;
        }
        return this.hasPermission(item.permission);
      });
  }

  // // Function to filter out menu items based on permissions
  // filterMenuByPermissions(menu: Array<NavItem>): Array<NavItem> {
  //   return menu.map(group => ({
  //     ...group,
  //     children: group.children ? this.filterChildrenByPermissions(group.children) : []
  //   })).filter(group => group.children.length > 0);
  // }

  // // Recursive function to filter children based on permissions
  // filterChildrenByPermissions(children: Array<NavItem>): Array<NavItem> {
  //   return children
  //     .map(item => ({
  //       ...item,
  //       children: item.children ? this.filterChildrenByPermissions(item.children) : []
  //     }))
  //     .filter(item => {
  //       if (!item.permission) {
  //         // If the menu item does not have a permission specified, include it in the filtered menu
  //         return true;
  //       }
  //       return this.hasPermission(item.permission);
  //     });
  // }

  // Function to update the menu based on user permissions
  updateMenu(): void {
    this.navItems = this.filterMenuByPermissions(this.navItems);
  }

           // USER ROLES
           public getUserRole(): any {
            return localStorage.getItem('roles');

          }

          public get isStaff(): boolean {
            return this.getUserRole() === 'ROLE STAFF';
          }


  //====================================== code zangu mwisho hapa ============================
}
