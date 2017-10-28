import {Injectable} from '@angular/core';
import { Response } from '@angular/Http';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ConfigService} from './systemconfig.service';

@Injectable()
export class AuthSystemOpenGuard implements CanActivate {

  constructor(private configService:ConfigService, private router:Router,
              private route:ActivatedRoute) {
  }

  canActivate(route:ActivatedRouteSnapshot,
              state:RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean {

    if (!this.configService.isSystemConfigSet()) {
      this.configService.getConfigInformation().subscribe((res:Response) => {
        if (res != null) {
          this.configService.setSystemConfiguration(res)
          this.redirectToClosedComponent();
        } else {
          this.router.navigate(['/registration-closed'], {relativeTo: this.route});
        }
      }, (res:Response) => {
        this.router.navigate(['../request-error'], {relativeTo: this.route});
      });
    } else {
      this.redirectToClosedComponent()
    }


    return true;
  }

  redirectToClosedComponent(){
    if (!this.configService.isSystemOpenAtThisMoment()) {
      this.router.navigate(['/registration-closed'], {relativeTo: this.route});
    }
  }
}
