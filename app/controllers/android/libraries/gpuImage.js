/**
 * Play with image filters
 * @author Jorge Macías <jormagar@gmail.com>
 */

import Activity from 'android.app.Activity';
import BitmapFactory from 'android.graphics.BitmapFactory';
import GPUImageView from 'jp.co.cyberagent.android.gpuimage.GPUImageView';
import GPUImageFilter from 'jp.co.cyberagent.android.gpuimage.filter.*';

const FX_PANEL_HEIGHT = 144;
const DEFAULT_SLIDER_DISPLAY_VALUE = '50';
const DEFAULT_SLIDER_VALUE = 100;
const SAMPLE_IMAGE = 'Resources/images/road.jpg';

const fx = {
	'Normal': 'GPUImageFilter',
	'Contrast': 'GPUImageContrastFilter',
	'Gray Scale': 'GPUImageGrayscaleFilter',
	'Sketch': 'GPUImageSketchFilter',
	'Gaussian Blur': 'GPUImageGaussianBlurFilter',
	'Pixelate': 'GPUImagePixelationFilter',
	'Edge Detection': 'GPUImageSobelEdgeDetectionFilter',
	'Invert': 'GPUImageColorInvertFilter',
	'Sepia': 'GPUImageSepiaToneFilter',
	'Emboss': 'GPUImageEmbossFilter',
	'Posterize': 'GPUImagePosterizeFilter',
	'Toon': 'GPUImageToonFilter',
	'Swirl': 'GPUImageSwirlFilter',
	'Saturation': 'GPUImageSaturationFilter'
};

const canAdjustFx = ['GPUImageContrastFilter', 'GPUImageSaturationFilter'];

const fxManager = {
	values: {
		label: null,
		fx: null
	},
	get label() {
		return this.values.label;
	},
	set label(value) {
		this.values.label = value;
	},
	get fx() {
		return this.values.fx;
	},
	set fx(value) {
		this.values.fx = value;
	}
};

/** Callback that is invoked when the activity has been created or recreated. */
$.win.activity.onCreate = () => {
	const activity = new Activity($.win.activity);
	addImageView(activity);
	addFxItemsToScrollView();
	loadResource(activity, SAMPLE_IMAGE);
};

/**
 * Callback on window postlayout. It is needed to fix
 * border radius problems on Android
 * @method onPostlayout
 * @param  {object}     e
 */
function onPostlayout(e) {
	//Fix for borderRadius
	$.addClass($.settings, 'radius-circle');
	$.addClass($.sliderValueContainer, 'radius-circle');
	$.addClass($.sliderContainer, 'radius-slider-container');
	//Fix change slider listener. Fired twice if values are set on tss
	$.addListener($.slider, 'change', onSliderChange);
}
$.win.addEventListener('postlayout', onPostlayout);

/**
 * Add native GPUImageView to Ti View hierarchy
 * @method addImageView
 * @param {object} activity
 */
function addImageView(activity) {
	//Save instance of GPUImageView. GPUImageView needs the context
	$['image'] = new GPUImageView(activity);
	//Add image to hierarchy
	$.bitmapContainer.add($.image);
}

/**
 * Add FX items to ScrollView
 * @method addFxItemsToScrollView
 */
function addFxItemsToScrollView() {
	Object.keys(fx).forEach(function (key, index) {
		createLabel(key, index);
	});
}

/**
 * Create FX label
 * @method createLabel
 * @param  {string}    fxFilter
 * @param  {number}    index
 * @return {object}    Ti Label
 */
function createLabel(fxFilter, index) {
	const isFirstItem = index === 0;

	const label = Ti.UI.createLabel({
		left: 8,
		right: 8,
		width: 80,
		height: 80,
		text: fxFilter,
		fx: fx[fxFilter],
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color: '#F6F6F6',
		font: {
			fontSize: 16,
			fontWeight: (isFirstItem) ? 'bold' : 'normal'
		}
	});

	$.addListener(label, 'click', onFxClick);

	//Save references from current fx and label
	if (isFirstItem) {
		fxManager.label = label;
		fxManager.fx = fx[fxFilter];
	}

	$.fxPanel.add(label);
}

/**
 * Loads resource to ImageView
 * @method loadResource
 * @param {object} activity
 * @param {string} path
 */
function loadResource(activity, path) {
	//Get resource stream from assets
	const stream = activity.getAssets().open(path);
	if (stream) {
		//Decoding stream to Bitmap. GPUImageView uses Bitmap like input param
		$.image.setImage(BitmapFactory.decodeStream(stream));
		//Important to close the stream to avoid memory leaks
		stream.close();
	} else {
		Ti.API.error('Resource <' + path + '> not found.');
	}
}

/**
 * Callback click on FX
 * @method onFxClick
 * @param  {object}  e
 */
function onFxClick(e) {
	try {
		if (fxManager.fx !== e.source.fx) {
			//Reset slider value
			resetSlider();

			//Reset previous fx label
			fxManager.label.applyProperties({
				font: {
					fontWeight: 'normal'
				}
			});
			//Activate current fx label
			e.source.applyProperties({
				font: {
					fontWeight: 'bold'
				}
			});
			//Save current fx and label
			fxManager.label = e.source;
			fxManager.fx = e.source.fx;

			setFilter(e.source.fx);
		}
	} catch (e) {
		Ti.API.error('Error in onFxClick callback: ' + e.message);
	}
}

/**
 * Reset slider
 * @method resetSlider
 */
function resetSlider() {
	//Limits are 0 - 200 but display 0 - 100
	$.sliderValue.text = DEFAULT_SLIDER_DISPLAY_VALUE;
	//Reset slider to default value
	$.slider.value = DEFAULT_SLIDER_VALUE;
}

/**
 * Set filter to image
 * @method setFilter
 * @param  {string}  filter
 */
function setFilter(filter) {
	//Check if selected filter can be adjusted
	const canAdjust = (canAdjustFx.indexOf(filter) !== -1) ? true : false;

	//If can adjusted show slider and display value
	$.sliderContainer.visible = canAdjust;
	$.sliderValueContainer.visible = canAdjust;

	const FilterClass = GPUImageFilter[filter];
	$.image.setFilter(canAdjust ? new FilterClass($.slider.value / 100) : new FilterClass());
}

/**
 * Toggle fx panel
 * @method onToggleFxPanel
 * @param  {object}      e
 */
function onToggleFxPanel(e) {
	let fxPanelParams = {
		bottom: 0,
		duration: 750
	}
	let sliderValueParams = {
		opacity: 1,
		duration: 750
	};

	if ($.settingsPanel.bottom === 0) {
		fxPanelParams = {
			bottom: -FX_PANEL_HEIGHT,
			duration: 750
		};
		sliderValueParams = {
			opacity: 0,
			duration: 750
		};
	}

	$.settingsPanel.animate(fxPanelParams);
	$.sliderValue.animate(sliderValueParams);
}
$.settings.addEventListener('click', onToggleFxPanel);

/**
 * Callback change value on slider
 * @method onSliderChange
 * @param  {object}       e
 */
function onSliderChange(e) {
	$.sliderValue.text = Math.trunc(e.value / 2);
	setFilter(fxManager.fx);
}
