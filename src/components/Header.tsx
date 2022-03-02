import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {todoScreenProp} from 'src/screens/Todo';
import Icon from 'react-native-vector-icons/FontAwesome';

export type Props = {
  title: String;
  backIcon: boolean | null;
};

const Header: React.FC<Props> = ({title, backIcon}) => {
  const navigation = useNavigation<todoScreenProp>();
  return (
    <View style={styles.container}>
      {backIcon ? (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.goback}>
          <Icon name="long-arrow-left" size={25} color={'#000'} />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#a9c3e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  goback: {
    position: 'absolute',
    top: 0,
    left: 10,
    height: 50,
    justifyContent: 'center',
  },
});
