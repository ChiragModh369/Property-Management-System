import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Group, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useContext } from "react";
import UserDetailContext from "../../context/UserDetailContext";
import useProperties from "../../hooks/useProperties.jsx";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { getProperty, updateResidency } from "../../utils/api";

const UpdateFacilities = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setUpdateOpened,
  setActiveStep,
}) => {
  const { pathname } = useLocation();
  //   console.log(pathname);
  const id = pathname.split("/").slice(-1)[0];
  //   console.log(id);
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );

  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities.bedrooms,
      parkings: propertyDetails.facilities.parkings,
      bathrooms: propertyDetails.facilities.bathrooms,
    },
    validate: {
      bedrooms: (value) => (value < 1 ? "Must have atleast 1 room" : null),
      bathrooms: (value) => (value < 1 ? "Must have atleast 1 bathroom" : null),
    },
  });

  const { bedrooms, parkings, bathrooms } = form.values;

  const {
    userDetails: { token },
  } = useContext(UserDetailContext);

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        facilities: { bedrooms, parkings, bathrooms },
      }));
    }
  };

  //   Update

  const { refetch: refetchProperties } = useProperties();

  const { mutate: updatePropery, isLoading: Updating } = useMutation({
    mutationFn: () =>
      updateResidency(
        id,
        {
          ...propertyDetails,
          facilities: { bedrooms, parkings, bathrooms },
        },
        token
      ),
    onSuccess: () => {
      toast.success("Residency Updated Successfully", {
        position: "bottom-right",
      });
    },
    onSettled: () => {
      setUpdateOpened(false);
      setActiveStep(0);
      refetchProperties();
    },
  });

  return (
    <Box maw={"30%"} mx="auto" my="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NumberInput
          withAsterisk
          label="No of Bedrooms"
          min={0}
          {...form.getInputProps("bedrooms")}
        />

        <NumberInput
          withAsterisk
          label="No of Parkings"
          min={0}
          {...form.getInputProps("parkings")}
        />

        <NumberInput
          withAsterisk
          label="No of Bathrooms"
          min={0}
          {...form.getInputProps("bathrooms")}
        />

        <Group position="center" mt={"xl"}>
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button
            type="submit"
            color="green"
            onClick={() => updatePropery()}
            disabled={isLoading}
          >
            {isLoading ? "Updating" : "Update Property"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default UpdateFacilities;
