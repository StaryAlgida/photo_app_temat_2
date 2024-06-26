import {FC, useState} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {format} from "date-fns";
import {Badge, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import ModalDelete from "./ModalDelete.tsx";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";

interface Annotation {
  text: string
}

interface ImgData {
  annotations: Annotation[];
  id: number;
  image: string;
  owner: string;
  owner_id: string;
  title: string;
  uploaded_on: string;
}


interface ImagesComponentProps {
  data: ImgData[];
}


const ImagesComponent: FC<ImagesComponentProps> = ({data}) => {

  const [show, setShow] = useState(false)
  const [selectedImg, setSelectedImg] = useState<ImgData>()
  const {userName} = useSessionContext()
  const handleClose = () => setShow(false)
  const handleOpen = (img: ImgData) => {
    setSelectedImg(img)
    setShow(true)
  }
  const formatDate = (value: string) => {
    return format(new Date(value), "yyyy-MM-dd")
  }


  return (
      <>
        {data.map((img) => (
            <Col xs={12} md={6} lg={4} xxl={3} className="mb-3" key={img.id}>
              <Card className="card-width">
                <Card.Img variant="top" src={`http://localhost:8000/${img.image}`} className="img-size"/>
                <Card.Body>
                  <Card.Title>{img.title}</Card.Title>
                  <Card.Text>
                    {img.annotations.length === 0 && "No annotation found"}
                    {img.annotations.slice(0, 3).map((annotation, index) => (
                        <Badge key={index} bg="primary" className="me-2">{annotation.text}</Badge>
                    ))}
                  </Card.Text>
                  <Link to={`${img.id}`}>
                    <Button variant="primary" className="mx-2">Info</Button>
                  </Link>
                  {userName === img.owner &&
                      <Button variant="danger" onClick={() => handleOpen(img)}>
                          Delete
                      </Button>
                  }
                </Card.Body>
                <div className="ps-3 d-flex flex-row gap-3">
                  <p>Created: {formatDate(img.uploaded_on)}</p>
                  <p>Owner: <b>{img.owner}</b></p>
                </div>
              </Card>
            </Col>
        ))}
        {selectedImg &&
            <ModalDelete
                showModal={show}
                pictureTitle={selectedImg.title}
                handleClose={handleClose}
                id={selectedImg.id}
            />
        }
      </>
  )
}

export default ImagesComponent