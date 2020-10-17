import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

interface OrphanageDataParams {
  position: {
    latitude: number,
    longitude: number,
  }
}

interface Orphanage {
  name: string,
  latitude: number,
  longitude: number,
  about: string,
  instructions: string,
  opeining_hours: string,
  open_on_weekends: boolean,
}

export default function OrphanageData() {

  const navigation = useNavigation();
  const routes = useRoute();

  const { position } = routes.params as OrphanageDataParams;

  const [ name, setName ] = useState('');
  const [ about, setAbout ] = useState('');
  const [ instructions, setInstructions ] = useState('');
  const [ openingHours, setOpeningHours ] = useState('');
  const [ openOnWeekends, setOpenOnWeekends ] = useState(true);
  const [ images, setImages ] = useState<string[]>([]);

  async function handleCreateOrphanage() {

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', openingHours);
    data.append('open_on_weekends', String(openOnWeekends));

    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}`,
        type: 'image/jpg',
        uri: image
      } as any);
    });

    await api.post('orphanages', data);

    navigation.navigate('OrphanagesMap');
  }

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    if (status !== 'granted') {
      alert('Eita, precisamos de acesso à sua galeria...');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.cancelled) {
      return;
    }

    const { uri: image } = result;

    setImages([ ...images, image ]);
  }

  return (
    <ScrollView style={ styles.container } contentContainerStyle={ { padding: 24 } } showsVerticalScrollIndicator={ false }>
      <Text style={ styles.title }>Dados</Text>

      <Text style={ styles.label }>Nome</Text>
      <TextInput
        style={ styles.input }
        value={ name }
        onChangeText={ text => setName(text) }
      />

      <Text style={ styles.label }>Sobre</Text>
      <TextInput
        style={ [ styles.input, { height: 110 } ] }
        multiline
        value={ about }
        onChangeText={ text => setAbout(text) }
      />

      {/* <Text style={ styles.label }>Whatsapp</Text>
      <TextInput
        style={ styles.input }
      /> */}

      <Text style={ styles.label }>Fotos</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={ false }>
        { images.map(image => (
          <Image
            key={ image }
            source={ { uri: image } }
            style={ styles.uploadedImage }
          />
        )) }
      </ScrollView>

      <TouchableOpacity style={ styles.imagesInput } onPress={ handleSelectImages }>
        <Feather name="plus" size={ 24 } color="#15B6D6" />
      </TouchableOpacity>

      <Text style={ styles.title }>Visitação</Text>

      <Text style={ styles.label }>Instruções</Text>
      <TextInput
        style={ [ styles.input, { height: 110 } ] }
        multiline
        value={ instructions }
        onChangeText={ text => setInstructions(text) }
      />

      <Text style={ styles.label }>Horario de visitas</Text>
      <TextInput
        style={ styles.input }
        value={ openingHours }
        onChangeText={ text => setOpeningHours(text) }
      />

      <View style={ styles.switchContainer }>
        <Text style={ styles.label }>Atende final de semana?</Text>
        <Switch
          thumbColor="#fff"
          trackColor={ { false: '#ccc', true: '#39CC83' } }
          value={ openOnWeekends }
          onValueChange={ value => setOpenOnWeekends(value) }
        />
      </View>

      <RectButton
        style={ styles.nextButton }
        onPress={ handleCreateOrphanage }
      >
        <Text style={ styles.nextButtonText }>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },

  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  uploadedImagesContainer: {
    // flexDirection: 'row',
    // paddingHorizontal: 16,
    // paddingRight: 8,
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 24,
    marginRight: 8,
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})