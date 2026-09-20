import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appAskForActions]'
})
export class AskForActions {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input() set appAskForActions(allowedRoles: string[]){
    const currentRole = this.authService.userLoging_$()?.role;

    if(currentRole && allowedRoles.includes(currentRole)){
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else{
      this.viewContainer.clear();
    }
  }

}
