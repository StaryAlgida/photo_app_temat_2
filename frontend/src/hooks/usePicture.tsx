import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useSessionContext} from "./useSessionContext.tsx";
import {string} from "yup";
import {useToaster} from "./useToaster.tsx";

interface PicData {
  id: number;
  image: string;
  image_url: string | null;
  owner: string;
  owner_id: number;
  title: string;
  uploaded_on: string; // or Date if you prefer to work with Date objects

}

export default function usePicture() {
  const {id} = useParams()
  const {tokens} = useSessionContext()
  const [picData, setPicData] = useState<PicData | null>(null)
  const [anData, setAnData] = useState<string[]>([])
  const [anLoading, setAnLoading] = useState(false)
  const [picLoading, setPicLoading] = useState(false)

  const {show} = useToaster()
  const getData = useCallback(async () => {
    try {
      setPicLoading(true)
      const {data} = await axios.get(`annotations/photo/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(tokens?.access),
        },
      })
      setPicData(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    } finally {
      setPicLoading(false)
    }
  }, [id, tokens?.access])

  useEffect(() => {
    getData().then()
  }, [getData]);

  const annotateImage = async () => {
    try {
      setAnLoading(true)
      const {data} = await axios.get<string[]>(`/annotations/photos_edit/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(tokens?.access),
        }
      })
      setAnData(data)
      console.log(data)
      if (data.length) {
        show({title: "Success", description: "Annotation found!", bg: "success"})
      } else {
        show({title: "Error", description: "Annotation not found!", bg: "danger"})
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    } finally {
      setAnLoading(false)
    }
  }

  return {annotateImage, picData, picLoading, anData, anLoading}
}