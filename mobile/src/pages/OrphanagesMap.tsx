import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { Feather } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import mapMarker from '../images/map-marker.png';
import api from '../services/api';

interface Orphanage {
  id: number,
  name: string,
  latitude: number,
  longitude: number,
}

export default function OrphanagesMap() {

  const navigation = useNavigation();

  const [ orphanages, setOrphanages ] = useState<Orphanage[]>([]);

  useFocusEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  });

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', { id });
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition');
  }

  return (
    <View style={ styles.container }>
      <MapView
        provider={ PROVIDER_GOOGLE }
        style={ styles.map }
        initialRegion={ {
          latitude: -15.8871739,
          longitude: -48.1214125,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } }
      >
        { orphanages.map(orphanage => (
          <Marker
            key={ orphanage.id }
            icon={ mapMarker }
            coordinate={ {
              latitude: orphanage.latitude,
              longitude: orphanage.longitude,
            } }
            calloutAnchor={ {
              x: 0.5,
              y: -0.1
            } }
          >
            <Callout tooltip onPress={ () => { handleNavigateToOrphanageDetails(orphanage.id) } } >
              <View style={ styles.calloutContainer }>
                <Text style={ styles.calloutText }>{ orphanage.name }</Text>
              </View>
            </Callout>
          </Marker>
        )) }

      </MapView>

      <View style={ styles.footer }>
        <Text style={ styles.footerText }>{ orphanages.length } orfanatos encontrados</Text>

        <RectButton style={ styles.createOrphanageButton } onPress={ handleNavigateToCreateOrphanage }>
          <Feather name="plus" size={ 20 } color="#FFF" />
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  calloutText: {
    color: '#0089a5',
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold'
  },

  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 3,
  },

  footerText: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold'
  },

  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center'
  },
});