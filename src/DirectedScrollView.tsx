import React, { Component } from 'react';
import ReactNative, {
  DeviceEventEmitter,
  requireNativeComponent,
  ScrollViewProps,
  UIManager,
  View,
} from 'react-native';

// @ts-ignore
// tslint:disable-next-line: no-submodule-imports
import ScrollResponder from './ScrollResponder';

interface NativeScrollViewProps extends ScrollViewProps {
  children?: React.ReactNode;
}

const NativeScrollView = requireNativeComponent<NativeScrollViewProps>('DirectedScrollView');

export type IDirectedScrollViewProps = ScrollViewProps & { onSwipeDown: () => void };

function createScrollResponder(node: DirectedScrollView): ScrollResponder.Mixin {
  const scrollResponder = { ...ScrollResponder.Mixin };

  for (const key in scrollResponder) {
    if (typeof scrollResponder[key] === 'function') {
      scrollResponder[key] = scrollResponder[key].bind(node);
    }
  }

  return scrollResponder;
}

export class DirectedScrollView extends Component<IDirectedScrollViewProps> {
  public state = {
    ...ScrollResponder.Mixin.scrollResponderMixinGetInitialState(),
  };

  private scrollViewRef = React.createRef<any>();
  private scrollResponder: ScrollResponder.Mixin = createScrollResponder(this);

  constructor(props: IDirectedScrollViewProps) {
    super(props);

    for (const key in ScrollResponder.Mixin) {
      if (typeof ScrollResponder.Mixin[key] === 'function' && key.startsWith('scrollResponder')) {
        (this as any)[key] = ScrollResponder.Mixin[key].bind(this);
      }
    }

    Object.keys(ScrollResponder.Mixin)
      .filter(key => typeof ScrollResponder.Mixin[key] !== 'function')
      .forEach(key => {
        (this as any)[key] = ScrollResponder.Mixin[key];
      });
  }

  public componentWillUnmount() {
    this.scrollResponder.componentWillUnmount();
  }

  public setNativeProps(props: IDirectedScrollViewProps) {
    if (this.scrollViewRef && this.scrollViewRef.current) {
      this.scrollViewRef.current.setNativeProps(props);
    }
  }

  public getScrollResponder() {
    return this.scrollResponder;
  }

  public getScrollableNode() {
    return ReactNative.findNodeHandle(this.scrollViewRef.current);
  }

  public scrollTo({ x, y, animated }: { x?: number; y?: number; animated?: boolean }) {
    UIManager.dispatchViewManagerCommand(
      this.getScrollableNode(),
      UIManager.getViewManagerConfig('DirectedScrollView').Commands.scrollTo,
      [x || 0, y || 0, animated !== false]
    );
  }

  public zoomToStart({ animated }: { animated: boolean }) {
    UIManager.dispatchViewManagerCommand(
      this.getScrollableNode(),
      UIManager.getViewManagerConfig('DirectedScrollView').Commands.zoomToStart,
      [animated !== false]
    );
  }

  public componentDidMount() {
    setTimeout(() => {
      try {
        this.zoomToStart({ animated: false });
      } catch (e) {}
    }, 0);

    DeviceEventEmitter.addListener('onSwipeDown', event => {
      if (this.props.hasOwnProperty('onSwipeDown') && this.props.onSwipeDown) {
        this.props.onSwipeDown();
      }
    });
  }

  public render() {
    return (
      <NativeScrollView
        {...this.props}
        ref={this.scrollViewRef}
        onScrollBeginDrag={this.scrollResponder.scrollResponderHandleScrollBeginDrag}
        onScrollEndDrag={this.scrollResponder.scrollResponderHandleScrollEndDrag}
        onScroll={this.scrollResponder.scrollResponderHandleScroll}
        onMomentumScrollBegin={this.scrollResponder.scrollResponderHandleMomentumScrollBegin}
        onMomentumScrollEnd={this.scrollResponder.scrollResponderHandleMomentumScrollEnd}
        onStartShouldSetResponder={this.scrollResponder.scrollResponderHandleStartShouldSetResponderCapture}
        onResponderGrant={this.scrollResponder.scrollResponderHandleResponderGrant}
        onResponderTerminationRequest={this.scrollResponder.scrollResponderHandleTerminationRequest}
        onResponderTerminate={this.scrollResponder.scrollResponderHandleTerminate}
        onResponderRelease={this.scrollResponder.scrollResponderHandleResponderRelease}
        onResponderReject={this.scrollResponder.scrollResponderHandleResponderReject}
      >
        <View style={this.props.contentContainerStyle} pointerEvents={'box-none'}>
          {this.props.children}
        </View>
      </NativeScrollView>
    );
  }
}

export default DirectedScrollView;
