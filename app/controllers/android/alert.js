import { Activity, AlertDialog } from 'android.app.*';
import OnClickListener from 'android.content.DialogInterface.OnClickListener';

function showAlert() {
  const builder = new AlertDialog.Builder(new Activity(Titanium.App.Android.getTopActivity()));

  builder.setTitle('My Title').setMessage('My Message').setCancelable(false); // modal
  builder.setPositiveButton('OK', new OnClickListener({
      onClick: (d, which) => {
          $.notice.text = 'Clicked!';
      }
  }));
  builder.create().show();
}
