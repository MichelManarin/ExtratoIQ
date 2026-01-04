import { CanDeactivateFn } from '@angular/router';
import { CanDeactivateComponent } from '@app/shared/base/component-base';

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component: CanDeactivateComponent
) => {
  if (component && typeof component.canDeactivate === 'function') {
    return component.canDeactivate();
  }
  return true;
};

