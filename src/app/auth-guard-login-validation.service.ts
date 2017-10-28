import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {FormService} from './form.service';

@Injectable()
export class AuthLoginGuard implements CanActivate {

  constructor(private formService:FormService, private router:Router) {
  }

  canActivate(route:ActivatedRouteSnapshot,
              state:RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean {

    if (!this.formService.isStudentNicAvailable()) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
