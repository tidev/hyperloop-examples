import FBShimmeringView from 'Shimmer/FBShimmeringView';

/**
 * Shimmer example
 * @author: etruta
 *
 * A example using a combination of Native UI (from cocoapod) and Titanium UI.
 */
(function (container) {
	const shimmeringView = new FBShimmeringView();
	const loadingLabel = Ti.UI.createLabel({
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		text: 'Shimmer',
		color: '#FFF',
		font: {
			fontFamily: 'HelveticaNeue-UltraLight',
			fontSize:48
		}
	});

	shimmeringView.shimmering = true;
	shimmeringView.shimmeringBeginFadeDuration = 0.3;
	shimmeringView.shimmeringOpacity = 0.3;
	shimmeringView.contentView = loadingLabel;

	container.add(shimmeringView);
})($.shimmer_container);
