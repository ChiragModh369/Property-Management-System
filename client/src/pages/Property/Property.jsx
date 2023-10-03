import React, { useContext, useState } from "react";
import "./Property.css";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getProperty,
  removeBooking,
  removeResidency,
  toFav,
} from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiTwotoneCar } from "react-icons/ai";
import { FaShower } from "react-icons/fa";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import Map from "../../components/Map/Map";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../../components/BookingModal/BookingModal";
import UserDetailContext from "../../context/UserDetailContext";
import { Button } from "@mantine/core";
import useAuthCheck from "../../hooks/useAuthCheck";
import { toast } from "react-toastify";
import Heart from "../../components/Heart/Heart";
import { updateFavourites } from "../../utils/common";
import UpdatePropertyModal from "../../components/UpdatePropertyModal/UpdatePropertyModal";

const Property = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();
  //   console.log(pathname);
  const id = pathname.split("/").slice(-1)[0];
  //   console.log(id);
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );
  // console.log(data);

  const [modalOpened, setModalOpened] = useState(false);
  const [UpdateModalOpened, setUpdateModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();

  const {
    userDetails: { token, bookings, favourites },
    setUserDetails,
  } = useContext(UserDetailContext);

  // console.log(bookings);
  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }));

      toast.success("Booking Cancelled", { position: "bottom-right" });
    },
  });
  // console.log(favourites);
  // console.log(id);
  // console.log(favourites == id);

  // console.log(hasFavourites);
  // console.log(hasFavourites == id);
  // Delete Favourites
  const { mutate } = useMutation({
    mutationFn: () => toFav(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        favourites: updateFavourites(id, prev.favourites),
      }));
    },
  });
  // Deleting Property
  const handelDeleteSuccess = () => {
    const hasBooked = bookings?.some((booking) => booking?.id === id);
    const hasFavourites = favourites?.filter((favourite) => favourite == id);
    if (hasFavourites == id) {
      mutate();
    }

    if (hasBooked) {
      cancelBooking();
    }

    navigate("/properties");
    toast.success("Residency Deleted", { position: "bottom-right" });
  };

  const { mutate: removeProperty, isLoading: Deleting } = useMutation({
    mutationFn: () => removeResidency(id, token),
    onSuccess: () => handelDeleteSuccess(),
    onError: ({ response }) => toast.error(response.data.message),
  });

  // Update

  const handleUpdatePropertyClick = () => {
    if (validateLogin) {
      setUpdateModalOpened(true);
    }
  };

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>Error while fetching the property details</span>
        </div>
      </div>
    );
  }
  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        {/* Like Buttom */}
        <div className="like">
          <Heart id={id} />
        </div>

        {/* Image */}
        <img src={data?.image} alt="image not found" />
        {/* ? will prevent from application crash if image not found */}

        <div className="flexCenter property-details">
          {/* left side*/}
          <div className="flexColStart left">
            <div className="flexStart head">
              <span className="primaryText">{data?.title}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                ₹{data?.price}
              </span>
            </div>

            {/* Facilities */}
            <div className="flexStart facilities">
              {/* Bathrooms */}
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities.bathrooms} Bathrooms</span>
              </div>

              {/* Parkings */}
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities.parkings} Parkings</span>
              </div>

              {/* Bedrooms */}
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities.bedrooms} Rooms</span>
              </div>
            </div>

            {/* Description */}
            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>

            {/* Address */}
            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data?.address},{data?.city},{data?.country}
              </span>
            </div>

            {/* Booking Button */}

            {bookings?.map((booking) => booking.id).includes(id) ? (
              <>
                <Button
                  variant="outline"
                  w={"100%"}
                  color="red"
                  onClick={() => cancelBooking()}
                  disabled={cancelling}
                >
                  <span>Cancel booking</span>
                </Button>
                <span>
                  Your visit already booked for date{" "}
                  {bookings?.filter((booking) => booking?.id === id)[0].date}
                </span>
              </>
            ) : (
              <button
                className="button"
                onClick={() => {
                  validateLogin() && setModalOpened(true);
                }}
              >
                Book Your Visit
              </button>
            )}
            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />

            {/* Update Button  */}
            {data?.userEmail == user?.email ? (
              <>
                <div className="flexStart  innerWidth property-container">
                  <Button
                    className="button"
                    onClick={handleUpdatePropertyClick}
                  >
                    Update
                  </Button>
                  <UpdatePropertyModal
                    updateModalOpened={UpdateModalOpened}
                    setUpdateOpened={setUpdateModalOpened}
                  />

                  <Button
                    className="button red"
                    onClick={() => removeProperty()}
                    disabled={Deleting}
                  >
                    <span> Delete</span>
                  </Button>
                </div>
              </>
            ) : (
              <span />
            )}
          </div>

          {/* Right side */}
          <div className="map">
            <Map
              address={data?.address}
              city={data?.city}
              country={data?.country}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Property;
