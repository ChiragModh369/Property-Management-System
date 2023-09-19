import React, { useState } from "react";
import "../Properties/Properties.css";
import SearchBar from "../../components/SeachBar/SearchBar";
// import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import UseAddedProperties from "../../hooks/useAddedProperties";
import { useAuth0 } from "@auth0/auth0-react";

const PersonalProperties = () => {
  const { user } = useAuth0();
  const { data, isError, isLoading } = UseAddedProperties();
  const [filter, setFilter] = useState("");
  console.log(data);
  if (isError) {
    return (
      <div className="wrapper">
        <span>Error While Fetching The Data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="8 0"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />
        <div className="paddings flexCenter properties">
          {data
            .filter(
              (property) =>
                property.title.toLowerCase().includes(filter.toLowerCase()) ||
                property.city.toLowerCase().includes(filter.toLowerCase()) ||
                property.country.toLowerCase().includes(filter.toLowerCase())
            )
            .map((card, i) => (
              <PropertyCard card={card} key={i} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalProperties;
