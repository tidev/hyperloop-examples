import UIKit
import Foundation

public class MyUI : UIView {

	public func makeRect (width : CGFloat, height : CGFloat) -> CGRect {
		return CGRectMake(0, 0, width, height)
	}

	public static func add (x : CGFloat) -> CGFloat {
		return x + 1
	}
}
