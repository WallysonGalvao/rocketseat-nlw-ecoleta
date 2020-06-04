import React, { useState, useEffect, ChangeEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import axios from "axios";

import api from "../../services/api";

import logo from "../../assets/logo.svg";

import "./styles.css";

interface IItems {
  id: number;
  title: string;
  image_url: string;
}

interface IState {
  sigla: string;
}

interface ICity {
  nome: string;
}

interface IForm {
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  uf: string;
  city: string;
  items: Array<number>;
}

const CreatePoint: React.FC = () => {
  const hisotry = useHistory();

  const [items, setItems] = useState<IItems[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [ufs, setUfs] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [data, setData] = useState<IForm>({} as IForm);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const IBGE_API_URL = "https://servicodados.ibge.gov.br/api/v1/";
  const IBGE_URL_PATH = "/localidades/estados";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get("items").then(({ data }) => setItems(data));
  }, []);

  useEffect(() => {
    axios
      .get(`${IBGE_API_URL}${IBGE_URL_PATH}?orderBy=nome`)
      .then(({ data }) => setUfs(data));
  }, []);

  useEffect(() => {
    if (data.uf) {
      const url = `${IBGE_API_URL}${IBGE_URL_PATH}/${data.uf}/municipios?orderBy=nome`;
      axios.get(url).then(({ data }) => setCities(data));
    }
  }, [data.uf]);

  useEffect(() => {
    setData({ ...data, items: selectedItems });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat: latitude, lng: longitude } = event.latlng;
    setPosition([latitude, longitude]);
    setData({ ...data, latitude, longitude });
  }

  async function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    await api.post("points", data);
    alert("Ponto de coleta criado!");
    hisotry.push("/");
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta Logo" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para a home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={currentPosition} zoom={15} onclick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position[0] !== 0 ? position : currentPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                id="uf"
                name="uf"
                value={data.uf}
                onChange={handleSelectChange}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map(({ sigla }) => (
                  <option key={sigla} value={sigla}>
                    {sigla}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={data.city}
                onChange={handleSelectChange}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(({ nome }) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                className={selectedItems.includes(item.id) ? "selected" : ""}
                onClick={() => handleSelectItem(item.id)}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
