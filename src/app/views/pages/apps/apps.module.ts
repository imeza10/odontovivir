import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import { NgbDropdownModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppsComponent } from './apps.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { EmailComponent } from './email/email.component';
import { InboxComponent } from './email/inbox/inbox.component';
import { ReadComponent } from './email/read/read.component';
import { ComposeComponent } from './email/compose/compose.component';
import { TakePicComponent } from './picture/take-pic.component';
import { LicenseComponent } from './license/license.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
]);

// ngx-quill
import { QuillModule } from 'ngx-quill';
import { ModalUserComponent } from './picture/modal-user/modal-user.component';
import { CameraComponent } from './picture/camera/camera.component';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { WorkingdayComponent } from './workingday/workingday.component';
import { MakedirComponent } from './makedir/makedir.component';
import { UsersComponent } from './users/users.component';
import { DetailUserComponent } from './users/detail-user/detail-user.component';
import { ExportRegisterComponent } from './export-register/export-register.component';

const routes: Routes = [
  {
    path: '',
    component: AppsComponent,
    children: [
      {
        path: '',
        redirectTo: 'calendar',
        pathMatch: 'full',
      },
      {
        path: 'email',
        component: EmailComponent,
        children: [
          {
            path: '',
            redirectTo: 'inbox',
            pathMatch: 'full'
          },
          {
            path: 'inbox',
            component: InboxComponent
          },
          {
            path: 'read',
            component: ReadComponent
          },
          {
            path: 'compose',
            component: ComposeComponent
          }
        ]
      },
      {
        path: 'chat',
        component: ChatComponent
      },
      {
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path: 'license',
        component: LicenseComponent,
        children: [
          {
            path: '',
            redirectTo: 'license',
            pathMatch: 'full'
          },
          {
            path: 'read',
            component: ReadComponent
          },
          {
            path: 'compose',
            component: ComposeComponent
          }
        ]
      },
      {
        path: 'picture',
        component: TakePicComponent
        
      },
      {
        path: 'workingday',
        component: WorkingdayComponent
        
      },
      {
        path: 'makedir',
        component: MakedirComponent        
      },
      {
        path: 'users',
        component: UsersComponent        
      },
      {
        path: 'export-register',
        component: ExportRegisterComponent        
      },
    ]
  }
]

@NgModule({
  declarations: [EmailComponent, ChatComponent, CalendarComponent, AppsComponent, InboxComponent, ReadComponent, ComposeComponent, TakePicComponent, LicenseComponent, ModalUserComponent, CameraComponent, LoaderComponent, WorkingdayComponent, MakedirComponent, UsersComponent, DetailUserComponent, ExportRegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FullCalendarModule, // import the FullCalendar module! will make the FullCalendar component available
    PerfectScrollbarModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    NgbCollapseModule,
    NgSelectModule,
    QuillModule.forRoot(), // ngx-quill
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AppsModule { }
