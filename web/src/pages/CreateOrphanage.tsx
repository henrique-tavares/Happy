import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from "leaflet";
import { useHistory } from "react-router-dom";

import { FiPlus } from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

import '../styles/pages/create-orphanage.css';

export default function CreateOrphanage() {

  const history = useHistory();

  const [ position, setPosition ] = useState<{ latitude: number, longitude: number } | undefined>();

  const [ name, setName ] = useState('');
  const [ about, setAbout ] = useState('');
  const [ instructions, setInstructions ] = useState('');
  const [ openingHours, setOpeningHours ] = useState('');
  const [ openOnWeekends, setOpenOnWeekends ] = useState(true);
  const [ images, setImages ] = useState<File[]>([]);
  const [ imagesPreview, setImagesPreview ] = useState<string[]>([]);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selecetedImages = Array.from(event.target.files);

    setImages(selecetedImages);

    const selectedImagesPreview = selecetedImages.map(selectedImage => {
      return URL.createObjectURL(selectedImage);
    });

    setImagesPreview(selectedImagesPreview);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();


    const { latitude, longitude } = position ? position : { latitude: 0, longitude: 0 };

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', openingHours);
    data.append('open_on_weekends', String(openOnWeekends));

    images.forEach(image => {
      data.append('images', image);
    });

    await api.post('orphanages', data);

    alert("Cadastro realizado com sucesso!");

    history.push("/app");
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form onSubmit={ handleSubmit } className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={ [ -15.8867411, -48.1233202 ] }
              style={ { width: '100%', height: 280 } }
              zoom={ 13 }
              onClick={ handleMapClick }
            >
              <TileLayer
                url={ `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}` }
              />
              { position && (
                <Marker
                  interactive={ false }
                  icon={ mapIcon }
                  position={ [ position.latitude, position.longitude ] }
                />
              ) }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={ name }
                onChange={ event => { setName(event.target.value) } }
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="about"
                maxLength={ 300 }
                value={ about }
                onChange={ event => { setAbout(event.target.value) } }
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                { imagesPreview.map(imagePreview => (
                  <img key={ imagePreview } src={ imagePreview } alt={ name } />
                )) }

                <label htmlFor="image-input" className="new-image">
                  <FiPlus size={ 24 } color="#15b6d6" />
                </label>
              </div>

              <input
                type="file"
                multiple
                id="image-input"
                onChange={ handleSelectImages }
              />
            </div>

          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={ instructions }
                onChange={ event => { setInstructions(event.target.value) } }
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={ openingHours }
                onChange={ event => { setOpeningHours(event.target.value) } }
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={ openOnWeekends ? "active" : "" }
                  onClick={ () => { setOpenOnWeekends(true) } }
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={ openOnWeekends ? "" : "active" }
                  onClick={ () => { setOpenOnWeekends(false) } }
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
