import { Container, Modal, Stepper } from "@mantine/core";
import React, { useState } from "react";
import AddLocation from "../AddLocation/AddLocation";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty } from "../../utils/api";
import UploadImage from "../UploadImage/UploadImage";
import BasicDetails from "../BasicDetails/BasicDetails";
import Facilities from "../Facilities/Facilities";
import UpdateFacilities from "../UpdateFacilities/UpdateFacilities";

const UpdatePropertyModal = ({ updateModalOpened, setUpdateOpened }) => {
  const [active, setActive] = useState(0);

  const { pathname } = useLocation();
  //   console.log(pathname);
  const id = pathname.split("/").slice(-1)[0];
  //   console.log(id);

  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );
  // console.log(data);
  const { user } = useAuth0();
  const [propertyDetails, setPropertyDetails] = useState({
    title: data.title,
    description: data.description,
    price: data.price,
    country: data.country,
    city: data.city,
    address: data.address,
    image: data.image,
    facilities: {
      bedrooms: data.facilities.bedrooms,
      parkings: data.facilities.parkings,
      bathrooms: data.facilities.bathrooms,
    },
    userEmail: user?.email,
  });
  const nextStep = () => {
    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  return (
    // <div></div>
    <Modal
      opened={updateModalOpened}
      onClose={() => setUpdateOpened(false)}
      closeOnClickOutside
      size={"75rem"}
    >
      <Container h={"35rem"} w={"100%"}>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Location" description="Address">
            <AddLocation
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step label="Images" description="Upload">
            <UploadImage
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step label="Basics" description="Details">
            <BasicDetails
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step>
            <UpdateFacilities
              prevStep={prevStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              setUpdateOpened={setUpdateOpened}
              setActiveStep={setActive}
            />
          </Stepper.Step>
        </Stepper>
      </Container>
    </Modal>
  );
};

export default UpdatePropertyModal;
