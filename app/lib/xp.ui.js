class NavigationWindow {
  constructor(args) {
    this.args = args;
  }

  open(options = {}) {
    options.displayHomeAsUp = false;
    return this.openWindow(this.args.window, options);
  }

  close(options = {}) {
    return this.closeWindow(this.args.window, options);
  }

  openWindow(window, options = {}) {
    options.swipeBack = (typeof options.swipeBack === 'boolean') ? options.swipeBack : this.args.swipeBack;
    options.displayHomeAsUp = (typeof options.displayHomeAsUp === 'boolean') ? options.displayHomeAsUp : this.args.displayHomeAsUp;

    if (OS_ANDROID && options.animated !== false) {
      options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
      options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
    }

    if (options.swipeBack !== false) {
      window.addEventListener('swipe', () => {
        if (e.direction === 'right') {
          this.closeWindow(window, options);
        }
      });
    }

    if (OS_ANDROID && options.displayHomeAsUp !== false && !window.navBarHidden) {
      window.addEventListener('open', () => {
        const activity = window.getActivity();
        if (activity) {
          const actionBar = activity.actionBar;
          if (actionBar) {
            actionBar.displayHomeAsUp = true;
            actionBar.onHomeIconItemSelected = () => {
              this.closeWindow(window, options);
            };
          }
        }
      });
    }

    return window.open(options);
  }

  closeWindow(window, options = {}) {
    if (OS_ANDROID && options.animated !== false) {
      options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
      options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
    }

    return window.close(options);
  }
}

const createNavigationWindow = (args) => {
  const navWin = OS_IOS ? Ti.UI.iOS.createNavigationWindow(args) : new NavigationWindow(args);

  if (args && args.id) {
    Alloy.Globals[args.id] = navWin;
  }

  return navWin;
}

export {
  createNavigationWindow
}
