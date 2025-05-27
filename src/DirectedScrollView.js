"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectedScrollView = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = __importStar(require("react-native"));
// @ts-ignore
// tslint:disable-next-line: no-submodule-imports
const ScrollResponder_1 = __importDefault(require("./ScrollResponder"));
const NativeScrollView = (0, react_native_1.requireNativeComponent)('DirectedScrollView');
function createScrollResponder(node) {
    const scrollResponder = Object.assign({}, ScrollResponder_1.default.Mixin);
    for (const key in scrollResponder) {
        if (typeof scrollResponder[key] === 'function') {
            scrollResponder[key] = scrollResponder[key].bind(node);
        }
    }
    return scrollResponder;
}
class DirectedScrollView extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, ScrollResponder_1.default.Mixin.scrollResponderMixinGetInitialState());
        this.scrollViewRef = react_1.default.createRef();
        this.scrollResponder = createScrollResponder(this);
        for (const key in ScrollResponder_1.default.Mixin) {
            if (typeof ScrollResponder_1.default.Mixin[key] === 'function' && key.startsWith('scrollResponder')) {
                this[key] = ScrollResponder_1.default.Mixin[key].bind(this);
            }
        }
        Object.keys(ScrollResponder_1.default.Mixin)
            .filter(key => typeof ScrollResponder_1.default.Mixin[key] !== 'function')
            .forEach(key => {
            this[key] = ScrollResponder_1.default.Mixin[key];
        });
    }
    componentWillUnmount() {
        this.scrollResponder.componentWillUnmount();
    }
    setNativeProps(props) {
        if (this.scrollViewRef && this.scrollViewRef.current) {
            this.scrollViewRef.current.setNativeProps(props);
        }
    }
    getScrollResponder() {
        return this.scrollResponder;
    }
    getScrollableNode() {
        return react_native_1.default.findNodeHandle(this.scrollViewRef.current);
    }
    scrollTo({ x, y, animated }) {
        react_native_1.UIManager.dispatchViewManagerCommand(this.getScrollableNode(), react_native_1.UIManager.getViewManagerConfig('DirectedScrollView').Commands.scrollTo, [x || 0, y || 0, animated !== false]);
    }
    zoomToStart({ animated }) {
        react_native_1.UIManager.dispatchViewManagerCommand(this.getScrollableNode(), react_native_1.UIManager.getViewManagerConfig('DirectedScrollView').Commands.zoomToStart, [animated !== false]);
    }
    componentDidMount() {
        setTimeout(() => {
            try {
                this.zoomToStart({ animated: false });
            }
            catch (e) { }
        }, 0);
        react_native_1.DeviceEventEmitter.addListener('onSwipeDown', event => {
            if (this.props.hasOwnProperty('onSwipeDown') && this.props.onSwipeDown) {
                this.props.onSwipeDown();
            }
        });
    }
    render() {
        return (react_1.default.createElement(NativeScrollView, Object.assign({}, this.props, { ref: this.scrollViewRef, onScrollBeginDrag: this.scrollResponder.scrollResponderHandleScrollBeginDrag, onScrollEndDrag: this.scrollResponder.scrollResponderHandleScrollEndDrag, onScroll: this.scrollResponder.scrollResponderHandleScroll, onMomentumScrollBegin: this.scrollResponder.scrollResponderHandleMomentumScrollBegin, onMomentumScrollEnd: this.scrollResponder.scrollResponderHandleMomentumScrollEnd, onStartShouldSetResponder: this.scrollResponder.scrollResponderHandleStartShouldSetResponderCapture, onResponderGrant: this.scrollResponder.scrollResponderHandleResponderGrant, onResponderTerminationRequest: this.scrollResponder.scrollResponderHandleTerminationRequest, onResponderTerminate: this.scrollResponder.scrollResponderHandleTerminate, onResponderRelease: this.scrollResponder.scrollResponderHandleResponderRelease, onResponderReject: this.scrollResponder.scrollResponderHandleResponderReject }),
            react_1.default.createElement(react_native_1.View, { style: this.props.contentContainerStyle, pointerEvents: 'box-none' }, this.props.children)));
    }
}
exports.DirectedScrollView = DirectedScrollView;
exports.default = DirectedScrollView;
