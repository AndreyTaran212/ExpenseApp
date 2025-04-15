import React, {ReactNode} from 'react';
import {View, ViewStyle, StatusBar, StyleProp} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface SafeViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SafeView: React.FC<SafeViewProps> = ({children, style}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}>
      <StatusBar />
      {children}
    </View>
  );
};

export default SafeView;
