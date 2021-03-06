import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import { Link, withRouter } from "react-router-dom";
import FormInput from "../../components/form-input/form-input";
import { createTrip, updateProfile } from "../../firebase/firebase.utils";
import firebase from "../../firebase/firebase.utils";
import { GenerateId } from "../../utils/id-generator";
import CustomButton from "../../components/custom-button/custom-button";
import loader from "../../assets/loader.gif";
import left from "../../assets/left.svg";

import "./create-ride.scss";
import FormSelect from "../../components/form-select/form-select";
class CreateRide extends Component {
  state = {
    pickUpPoint: "",
    destination: "",
    date: "",
    time: "",
    carType: "",
    numberPlate: "",
    seatCost: "",
    vacantSeats: "",
    today: "",
    description: "",
    errorMessage: "",
    channelsRef: firebase.database().ref("channels"),
    isSuccess: false,
    isLoading: false,
  };
  addChannel = async (channelId, channelName, channelDetails) => {
    const { channelsRef } = this.state;
    const { id, displayName } = this.props.currentUser;

    const newChannel = {
      id: channelId,
      name: channelName,
      details: channelDetails,
      createdBy: {
        id,
        name: displayName,
      },
    };
    await channelsRef
      .child(channelId)
      .update(newChannel)
      .then(() => {
        console.log("channel added");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      pickUpPoint,
      destination,
      date,
      time,
      numberPlate,
      description,
      seatCost,
      vacantSeats,
      carType,
    } = this.state;

    try {
      this.setState({ isLoading: true });
      const id = GenerateId();
      const tripData = {
        id,
        driver: {
          id: this.props.currentUser.id,
          name: this.props.currentUser.displayName,
          phone: this.props.currentUser.phone,
          email: this.props.currentUser.email,
          age: this.props.currentUser.age,
          gender: this.props.currentUser.gender,
          profile_pic: this.props.currentUser.profile_pic
            ? this.props.currentUser.profile_pic
            : "",
        },
        pickUpPoint: pickUpPoint.toLocaleLowerCase(),
        destination: destination.toLowerCase(),
        date,
        numberPlate,
        seatCost,
        description,
        time,
        vacantSeats,
        carType,
        passangers: [],
      };
      if (
        pickUpPoint === "" ||
        destination === "" ||
        date === "" ||
        time === "" ||
        carType === "" ||
        numberPlate === "" ||
        seatCost === "" ||
        vacantSeats === "" ||
        description === ""
      ) {
        this.setState({
          errorMessage: "All fields are required",
          isLoading: false,
        });
        return;
      }
      await createTrip(tripData, id);
      await updateProfile(this.props.currentUser.id, id);
      const channelName = `${pickUpPoint} to ${destination}`;
      const channelDetails = `Trip from ${pickUpPoint} to ${destination}`;
      this.addChannel(id, channelName, channelDetails);
      this.setState({
        pickUpPoint: "",
        destination: "",
        date: "",
        time: "",
        carType: "",
        numberPlate: "",
        seatCost: "",
        description: "",
        vacantSeats: "",
        isSuccess: true,
        errorMessage: false,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        isLoading: !this.setState.isLoading,
        errorMessage: "Failed Try Again",
      });
    }
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      errorMessage: "",
    });
  };
  componentDidMount() {
    const now = new Date();

    const day = ("0" + (now.getDate() + 1)).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);

    const today = now.getFullYear() + "-" + month + "-" + day;
    this.setState({ today });
  }
  render() {
    const {
      pickUpPoint,
      destination,
      date,
      time,
      vacantSeats,
      numberPlate,
      seatCost,
      carType,
      description,
      today,
      errorMessage,
      isSuccess,
      isLoading,
    } = this.state;
    return (
      <div className="create-ride">
        {errorMessage !== "" ? (
          <span className="error">{errorMessage}</span>
        ) : null}
        {isSuccess ? (
          <span className="success">Trip Successfully Created</span>
        ) : null}
        <div>
          <h3 className="title">CREATE TRIP</h3>
          <form onSubmit={this.handleSubmit}>
            <FormSelect
              name="pickUpPoint"
              value={pickUpPoint}
              opt="Pick Up Point"
              handleChange={this.handleChange}
              options={[
                "Alor Setar",
                "Batu Pahat",
                "Butterworth",
                "Cukai",
                "George Town",
                "Johor Bahru",
                "Ipoh",
                "Kampong Baharu",
                "Kampung Lemal",
                "Kampung Sungai Pasir",
                "Kangar",
                "Ketereh",
                "Klang",
                "Kulang",
                "Kota Bharu",
                "Kota Kinabalu",
                "Kuala Lipis",
                "Kuala Lumpur",
                "Kuala Terangganu",
                "Kuantan",
                "Kuching",
                "Melaka",
                "Lahad Datu",
                "Miri",
                "Muar",
                "Pasri Mas",
                "Pulai Chondong",
                "Raub",
                "Sandakan",
                "Seramban",
                "Seramban Garden",
                "Shah Alam",
                "Taiping",
                "Tawau",
                "Teluk intan",
                "Tumpat",
                "Victoria",
              ]}
            />
            <FormSelect
              name="destination"
              value={destination}
              opt="Destination"
              handleChange={this.handleChange}
              options={[
                "Alor Setar",
                "Batu Pahat",
                "Butterworth",
                "Cukai",
                "George Town",
                "Johor Bahru",
                "Ipoh",
                "Kampong Baharu",
                "Kampung Lemal",
                "Kampung Sungai Pasir",
                "Kangar",
                "Ketereh",
                "Klang",
                "Kulang",
                "Kota Bharu",
                "Kota Kinabalu",
                "Kuala Lipis",
                "Kuala Lumpur",
                "Kuala Terangganu",
                "Kuantan",
                "Kuching",
                "Melaka",
                "Lahad Datu",
                "Miri",
                "Muar",
                "Pasri Mas",
                "Pulai Chondong",
                "Raub",
                "Sandakan",
                "Seramban",
                "Seramban Garden",
                "Shah Alam",
                "Taiping",
                "Tawau",
                "Teluk intan",
                "Tumpat",
                "Victoria",
              ]}
            />
            <FormInput
              type="text"
              name="date"
              value={date}
              required
              min={today}
              handleChange={this.handleChange}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              label="Trip Date"
            />
            <FormInput
              type="text"
              name="time"
              value={time}
              required
              handleChange={this.handleChange}
              onFocus={(e) => (e.target.type = "time")}
              onBlur={(e) => (e.target.type = "text")}
              label="Trip Time"
            />
            <FormInput
              type="text"
              name="carType"
              value={carType}
              required
              handleChange={this.handleChange}
              label="Car Type"
            />
            <FormInput
              type="text"
              name="numberPlate"
              value={numberPlate}
              required
              handleChange={this.handleChange}
              label="Number Plate"
            />
            <FormInput
              type="number"
              name="vacantSeats"
              value={vacantSeats}
              required
              handleChange={this.handleChange}
              label="Vacant Seats"
            />
            <FormInput
              type="number"
              name="seatCost"
              value={seatCost}
              required
              handleChange={this.handleChange}
              label="Seat Cost"
            />
            <div className="text-area">
              <textarea
                required
                name="description"
                value={description}
                onChange={this.handleChange}
                className={`${description.length ? "expand" : null}`}
                cols="100"
                rows="1"
              ></textarea>
              <label
                className={`${
                  description.length ? "shrink" : ""
                } form-input-label`}
              >
                Description
              </label>
            </div>
            <div className="buttons">
              <CustomButton type="button" onClick={this.handleSubmit}>
                CREATE {isLoading ? <img src={loader} alt="Loader" /> : null}
              </CustomButton>
            </div>
          </form>
        </div>
        <div className="home">
          <Link to="/">
            <img src={left} alt="Back Icon" />
          </Link>
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});
export default withRouter(connect(mapStateToProps)(CreateRide));
