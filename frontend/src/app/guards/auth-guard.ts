import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router= inject(Router);

  const token = localStorage.getItem("token");
  const expiresDateStr = localStorage.getItem("expiresDate");

  if(!token || !expiresDateStr){
    return router.createUrlTree(['/logingAsk']);
  }

  const expiresDate = new Date(expiresDateStr);
  const now = new Date();

  if(now >= expiresDate){
    return router.createUrlTree(['/logingAsk']);
  }
  
  return true;
};
