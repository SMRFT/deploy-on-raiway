import Webcam from "react-webcam";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Label } from 'semantic-ui-react';
import { useForm } from "react-hook-form";
import { Col, FormControl, Row } from "react-bootstrap";
import "./Addemp.css";
import Myconstants from "../Components/Myconstants";
import { Radio, Checkbox } from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VerticalTabs from "./VerticalTabs";
import moment from "moment";


function Addemp() {
  const [page, setPage] = useState(1);
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [imgSrcname, setImgSrcname] = useState("");
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState('personal-info');
  const [id, setId] = useState("");
  const [mobile, setMobile] = useState("");
  const [shift, setshift] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("")
  const [dateofjoining, setDateOfJoining] = useState("");
  const [bankaccnum, setBankAccNum] = useState("");
  const [address, setAddress] = useState("");
  const [proof, setProof] = useState(null);
  const [certificates, setCertificate] = useState(null);
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");
  const [isShown, setIsShown] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [RNRNO, setRNRNO] = useState("");
  const [TNMCNO, setTNMCNO] = useState("");
  const [ValidlityDate, setValidlityDate] = useState("");
  const [Gender, setGender] = useState("");
  const [Maritalstatus, setMaritalstatus] = useState("");
  const [Aadhaarno, setAadhaarno] = useState("");
  const [PanNo, setPanNo] = useState("");
  const [IdentificationMark, setIdentificationMark] = useState("");
  const [BloodGroup, setBloodGroup] = useState("");
  const [languages, setLanguages] = useState([]);
  const [educationData, setEducationData] = useState([
    { SlNo: 1, degree: "SSLC", major: "", institution: "", marks: "", division: "", year: "" },
    { SlNo: 2, degree: "HSC", major: "", institution: "", marks: "", division: "", year: "" },
    { SlNo: 3, degree: "DIPLOMA", major: "", institution: "", marks: "", division: "", year: "" },
    { SlNo: 4, degree: "UG", major: "", institution: "", marks: "", division: "", year: "" },
    { SlNo: 5, degree: "PG", major: "", institution: "", marks: "", division: "", year: "" },
    { SlNo: 6, degree: "OTHER", major: "", institution: "", marks: "", division: "", year: "" },
  ]);
  const [experienceData, setExperienceData] = useState([
    { SlNo: 1, Organization: "", designation: "", lastdrawnsalary: "", location: "", experience: "" },
  ]);

  const addRow = () => {
    setExperienceData([...experienceData, { SlNo: experienceData.length + 1, Organization: "", designation: "", lastdrawnsalary: "", location: "", experience: "" }]);
  };

  const [referenceData, setReferenceData] = useState([
    { SlNo: 1, references: "", Organization: "", designation: "", ContactNo: "" },

  ]);

  const handleAddRow = () => {
    const newRow = { SlNo: referenceData.length + 1, references: "", Organization: "", designation: "", ContactNo: "" };
    setReferenceData([...referenceData, newRow]);
  };
  const departments = ["IT", "DOCTOR", "NURSE", "HR", "LAB", "RT TECH", "PHARMACY", "TELECALLER", "FRONT OFFICE", "SECURITY", "ELECTRICIAN", "ACCOUNTS", "NURSING", "HOUSE KEEPING", "DENSIST CONSULTANT", "COOK"];

  //Functions for selecting department using dropdown
  function handleChange(e) {
    setSelectedDepartment(e.target.value);
    if (e.target.value === "DOCTOR") {
      setTNMCNO("");

    } else if (e.target.value === "NURSE") {
      setRNRNO("");
      setValidlityDate("");
    }
  }

  const handleOnChange = (e, rowIndex, field) => {
    const updatedData = [...educationData];
    updatedData[rowIndex][field] = e.target.value;
    setEducationData(updatedData);
  }

  const handleChangeexp = (e, index, key) => {
    const { value } = e.target;
    const newData = [...experienceData];
    newData[index][key] = value;
    setExperienceData(newData);
  };

  const handleChangeref = (event, index, key) => {
    const newData = [...referenceData];
    newData[index][key] = event.target.value;
    setReferenceData(newData);
  };

  const handleClick = (event) => {
    console.log("handleClick called");
    setIsShown((current) => !current);
  };
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const handleImageSelect = (event) => {
    setImgSrc(event.target.files[0]);
  };

  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isCertificateSelected, setIsCertificateSelected] = useState(false);
  const handleFileSelect = (e) => {
    setProof(e.target.files[0]);
    setIsFileSelected(true);
  };

  const handleCertificateSelect = (e) => {
    setCertificate(e.target.files[0]);
    setIsCertificateSelected(true);
  };

  const handleRemoveCertificate = () => {
    setCertificate(null);
    setIsCertificateSelected(false);
    document.getElementById("selectCertificate").value = "";
  };
  const [dob, setDob] = useState(null); // Initialize the DOB state with current date
  const [age, setAge] = useState(0); // Initialize the age state with 0
  const handleDobChange = (date) => {
      setDob(date);
      setAge(getAge(date));
    };
    const getAge = (dob) => {
      if (!dob) {
        return '';
      }
      const diffMs = Date.now() - dob.getTime();
      const ageDt = new Date(diffMs);
      return Math.abs(ageDt.getUTCFullYear() - 1970);
    };
  const onSubmit = async (details) => {
    const data = new FormData();
    const comprefaceImage = new FormData();
    data.append("name", name);
    data.append("id", id);
    data.append("Gender", Gender);
    data.append("mobile", mobile);
    data.append("dob", dob.toISOString().split('T')[0]);
    data.append("age",age);
    data.append("department", selectedDepartment);
    data.append("RNRNO", RNRNO);
    data.append("languages",languages);
    data.append("TNMCNO", TNMCNO);
    data.append("ValidlityDate", ValidlityDate);
    data.append("designation", designation);
    data.append("email", email);
    data.append("dateofjoining", dateofjoining);
    data.append("bankaccnum", bankaccnum);
    data.append("address", address);
    data.append("Maritalstatus", Maritalstatus);
    data.append("Aadhaarno", Aadhaarno);
    data.append("PanNo", PanNo);
    data.append("salary", salary);
    // data.append("proof", proof);
    // data.append("certificates", certificates);
    data.append("shift", shift);
    data.append("IdentificationMark", IdentificationMark);
    data.append("BloodGroup", BloodGroup);
    data.append("educationData", JSON.stringify(educationData));
    data.append("experienceData", JSON.stringify(experienceData));
    data.append("referenceData", JSON.stringify(referenceData));
    data.append("imgSrc", imgSrc);
    data.append("", imgSrc);
  
    comprefaceImage.append("file", imgSrc);
    let formDataNew = new FormData();
    formDataNew.append("file", imgSrc);
    let formData = new FormData();
    // formData.append("file", proof);
    // formData.append("file", certificates);
    console.log(data)
    try {
      const res = await axios({
        method: "post",
        url: "http://127.0.0.1:7000/attendance/addemp/",
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: data,
      });

      if (res.status === 200) {
        setMessage(Myconstants.AddEmp);
      } else {
        setMessage(Myconstants.AddEmpError);
      }
    }
    catch (err) {
    }
  };

  // Refresh function
  function refreshPage() {
    {
      window.location.reload();
    }
  }
  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  //converting "Base64" to javascript "File Object"
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename);
  }
  const handleDateofjoiningChange = (date) => {
    setDateOfJoining(date);
  };
   // Validation for forms
   function validateName(name) {
    let error = "";
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    if (!capitalized.match(/^[a-zA-Z\s.]*$/)) {
      error = "*Name should only contain letters, spaces, and periods";
    }
    return error;
  }
  function validateSalary(salary) {
    let error = "";
    if (salary !== "" && !/^\d+$/.test(salary)) {
      error = "*Only numbers are allowed";
    }
    return error;
  }
  function validateId(id) {
    let error = "";
    if (!id.match(/^[0-9]*$/)) {
      error = "*Id should contain numbers only";
    }
    return error;
  }
  function validateMobile(mobile) {
    let error = "";
    if (mobile !== "" && !/^[0-9]{10}$/.test(mobile)) {
      error = "*Mobile Number should only contain 10 digits";
    }
    return error;
  }

  function validateDesignation(designation) {
    if (!designation.match(/^[a-zA-Z\s]*$/)) {
      return "*Designation should only contain letters and spaces";
    }
    return "";
  }
  
  function validatePanNo(PanNo) {
    let error = "";
    if (PanNo !== "" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(PanNo)) {
      error = "*Invalid PAN Card Number";
    }
    return error;
  }

  function validateAadhaarNo(AadhaarNo) {
    let error = "";
    if (AadhaarNo !== "" && !/^(\d{4}\s?){2}\d{4}$/.test(AadhaarNo)) {
      error = "*Invalid Aadhaar Number. Aadhaar should be 12 Digits with allowed spaces.";
    }
    return error;
  }

  function validateEmail(email) {
    let error = "";
    if (email !== "" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      error = "*Invalid email address";
    }
    return error;
  }

  function validateDateOfJoining(dateofjoining) {
    let error = "";
    if (dateofjoining !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(dateofjoining)) {
      error = "*Invalid date format. Please use YYYY-MM-DD";
    }
    return error;
  }

  function validateBankAccNum(bankaccnum) {
    let error = "";
    if (bankaccnum !== "" && !/^[0-9]{9,18}$/.test(bankaccnum)) {
      error = "*Invalid bank account number. It should contain 9 to 18 digits";
    }
    return error;
  }

  function validateAddress(address) {
    let error = "";
    if (!address.match(/^[0-9/,a-zA-Z- 0-9.]*$/)) {
      error = "*Address should only contain numbers, letters, commas, dots, slashes, and spaces";
    }
    return error;
  }
  const handleOnChangeeducation = (e, index, field) => {
    const { value } = e.target;
    setEducationData((prevState) =>
      prevState.map((data, i) => (i === index ? { ...data, [field]: value } : data))
    );
  };
  const validateMajor = (major) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!major) {
      return " ";
    } else if (!regex.test(major)) {
      return "Only alphabets with spaces allowed in Major field";
    } else {
      return null;
    }
  };
  const validateInstitution = (institution) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!institution) {
      return " ";
    } else if (!regex.test(institution)) {
      return "Only alphabets with spaces allowed in Institution field";
    } else {
      return null;
    }
  };
  const validateMarks = (marks) => {
    const regex = /^[0-9]*$/;
    if (!marks) {
      return " ";
    } else if (!regex.test(marks)) {
      return "Only numbers allowed in Marks field";
    } else {
      return null;
    }
  };
  const validateDivision = (division) => {
    const regex = /^[a-zA-Z\s]*$/;
    const romanRegex = /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
    if (!division) {
      return " ";
    } else if (!regex.test(division) && !romanRegex.test(division)) {
      return "Only alphabets with spaces and roman letters allowed in Division field";
    } else {
      return null;
    }
  };

  const [languagesError, setLanguagesError] = useState("");
  const validateLanguages = () => {
    let error = "";
    if (languages !== "" && !/^[a-zA-Z]+(,[a-zA-Z]+)*$/.test(languages)) {
      error = "*Only alphabets and commas are allowed";
    }
    setLanguagesError(error);
  };

  const validateYear = (year) => {
    const regex = /^(19|20)\d{2}$/;
    if (!year) {
      return " ";
    } else if (!regex.test(year)) {
      return "Only valid years allowed in Year of Passing field";
    } else {
      return null;
    }
  };
  const handleOnChangeexperience = (e, index, field) => {
    const { value } = e.target;
    setExperienceData((prevState) =>
      prevState.map((data, i) => (i === index ? { ...data, [field]: value } : data))
    );
  };
  const validateOrganization = (organization) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!organization) {
      return " ";
    } else if (!regex.test(organization)) {
      return "Only alphabets with spaces allowed in Organization field";
    } else {
      return null;
    }
  };
  const validateexpDesignation = (designation) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!designation) {
      return " ";
    } else if (!regex.test(designation)) {
      return "Only alphabets with spaces allowed in Designation field";
    } else {
      return null;
    }
  };
  const validateLastDrawnSalary = (lastDrawnSalary) => {
    const regex = /^[0-9]*$/;
    if (!lastDrawnSalary) {
      return " ";
    } else if (!regex.test(lastDrawnSalary)) {
      return "Only numbers allowed in Last Drawn Salary field";
    } else {
      return null;
    }
  };
  const validateLocation = (location) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!location) {
      return " ";
    } else if (!regex.test(location)) {
      return "Only alphabets with spaces allowed in Location field";
    } else {
      return null;
    }
  };
  const validateExperience = (experience) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}\sto\s(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    if (!experience) {
      return " ";
    } else if (!regex.test(experience)) {
      return "Experience field should be in the format of 'dd/mm/yyyy to dd/mm/yyyy'";
    } else {
      return null;
    }
  };
  const handleOnChangeReference = (e, index, field) => {
    const { value } = e.target;
    setReferenceData((prevState) =>
      prevState.map((data, i) => (i === index ? { ...data, [field]: value } : data))
    );
  };
  const validateReferences = (references) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!references) {
      return " ";
    } else if (!regex.test(references)) {
      return "Only alphabets with spaces allowed in References field";
    } else {
      return null;
    }
  };
  function validateMobile(mobile) {
    let error = "";
    if (mobile !== "" && !/^[0-9]{10}$/.test(mobile)) {
      error = "*Mobile Number should only contain 10 digits";
    }
    return error;
  }
  const validaterefContactNo = (contactNo) => {
    const isValidPhone = /^\d{10}$/.test(contactNo);
    const isValidLandline = /^\d{8}$/.test(contactNo);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactNo);
    if (contactNo !== "" && !isValidPhone && !isValidLandline && !isValidEmail) {
      return "Invalid Contact Details";
    } else {
      return null;
    }
  }
  const DEPARTMENT_OPTIONS = Myconstants.departments;
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [certificatesFile, setCertificatesFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  useEffect(() => {
    if (imgSrc) {
      setImage(URL.createObjectURL(imgSrc));
    }
  }, [imgSrc]);
  const Capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    toDataURL(imageSrc).then((dataUrl) => {
      var fileData = dataURLtoFile(dataUrl, "image.jpg");
     // let formData = new FormData();
      //formData.append("file", fileData);
      //formData.append("file", imageSrc);
      setProfileImageFile(fileData);
      setImageSrc(imageSrc)
      console.log("____",fileData)
      
    });
  }, [webcamRef, setImgSrc]);
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (event.target.name === 'proof') {
      setProofFile(file);
    } else if (event.target.name === 'certificates') {
      setCertificatesFile(file);
    } else if (event.target.name === 'imgSrc') {
      console.log("i am here",file)
      setProfileImageFile(file);
    }
  };
  const handleRemoveFile = () => {
    setProofFile(null);
    document.getElementById("selectFile").value = "";
  };
  const handleRemoveFile3 = () => {
    setCertificatesFile(null);
    document.getElementById("selectFile").value = "";
  };
  const handleRemoveImage = () => {
    setProfileImageFile(null);
    document.getElementById("selectImage").value = "";
  };
  const handleSubmit2 = async () => {
    const formData = new FormData();
    formData.append('employee_name', name);
    formData.append('employee_id', id);
    formData.append('proof', proofFile);
    formData.append('certificates', certificatesFile);
    formData.append('imgSrc', profileImageFile);
  
    try {
      await axios.post('http://127.0.0.1:7000/attendance/upload_file/', formData);
      // Handle successful file upload
      console.log('Files uploaded successfully');
      setUploadSuccess(true);
    } catch (error) {
      // Handle error
      console.error('File upload failed:', error);
    }
  };
  
  const handleCombinedClick = async () => {
    console.log("handleCombinedClick called");
    await handleSubmit2();
    handleClick();
  };
  
  
  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };
  const tabs =[
  
    {
      title: "Personal Details",
      content:(
        <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {page === 1 && (
          <div>
           <div className="row">   
            <div className="col-sm-6"> 
              <Form.Field>
              <Col>
              <div className="mb-3">
              <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Name<span style={{color: "red"}}> *</span></div></label>
              <div className="col-sm-7">
              <input style={{ borderRadius: 40 ,width:"100%"}}
                  className=" mx-4 form-control"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  ref={register("name", { pattern: /^[a-zA-Z]*$/ })}
                  required
                  autoComplete="off"
                  onChange={(e) => {setName(e.target.value);validateName(e.target.value);}}
                />
                <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>
                  {validateName(name) ? <p>{validateName(name)}</p> : null}
                </div>
                </div>
                </div>
                </Col>
              </Form.Field>
            </div>
            <br/>
            <div className="col-sm-6">
            <Form.Field>
      <Col>
      <div className="col-sm-6">
            <label className="mx-3 form-label">
              <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>
                Date Of Joining
              </div>
            </label>
            <input
                className="form-control-label text-muted"
                style={{ borderRadius: 140, width: "150px", borderColor: "lightgrey", borderWidth: "1px", height: "0.9cm", padding: "10px" }}
                placeholder="Select Date"
                onClick={() => document.getElementById('dateofjoining-picker').click()}
                value={dateofjoining ? moment(dateofjoining).format('YYYY-MM-DD') : ''}
              />
              <DatePicker
                id="dateofjoining-picker"
                selected={dateofjoining}
                onChange={handleDateofjoiningChange}
                dateFormat="yyyy-MM-dd"
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="d-none"
              />
              </div>
             
      </Col>
    </Form.Field>
              </div>
              </div>
            <div className="row">   
            <div className="col-sm-6">
            <br/>
              <Form.Field>
              <Col>
              <div className="mb-3">
              <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Id<span style={{color: "red"}}> *</span></div></label>
              <div className="col-sm-7">
              <input style={{ borderRadius: 40 ,width:"100%"}}
                  className=" mx-4 form-control"
                  type="text"
                  value={id}
                  placeholder="Enter ID here"
                  ref={register("id", { pattern: /^[0-9]*$/ })}
                  required
                  autoComplete="off"
                  onChange={(e) => {
                    setId(e.target.value);
                    validateId(e.target.value);
                  }}
                />
                <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>
                  {validateId(id) ? <p>{validateId(id)}</p> : null}
                </div>
                </div>
                </div>
                </Col>
              </Form.Field>
            </div>
         
            <div className="col-sm-6">
            <br/>
            <Form.Field>
           <Col>
            <div className="mb-3">
            {/* <label className=" mx-3 form-label">
            <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Date Of Birth:</div>
          </label> */}
          <div className="mx-2 row">
         <div className="col-sm-6">
      <label>
        <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Date Of Birth:</div>
        <input 
          type="text"
          className="mx-3"
          placeholder="Select Date"
          style={{ width: "130px",borderColor:"lightgrey",borderWidth:"1px",height:"0.9cm" }}
          readOnly
          onClick={() => document.getElementById('dob-picker').click()}
          value={dob ? dob.toDateString() : ''}
        />
        <DatePicker
          id="dob-picker"
          selected={dob}
          onChange={handleDobChange}
          dateFormat="yyyy-MM-dd"
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          className="d-none"
        />
      </label>
    </div>
    <div className="col-sm-6">
      <label>
        <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Age:</div>
        <input
          type="text"
          className="mx-2"
          style={{ width: "50px",borderColor:"lightgrey",borderWidth:"1px",height:"0.9cm" }}
          value={age}
          readOnly
        />
      </label>
      </div>
  </div>   
  </div>
  </Col> 
  </Form.Field>
   </div>
    </div>
      <div className="row">
          <div className="col-sm-6">
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Mobile Number</div></label>
                    <div className="col-sm-7">
                      <input style={{ borderRadius: 40 ,width:"100%"}}
                        className=" mx-4 form-control"
                        type="text"
                        value={mobile}
                        placeholder="Enter your mobile number"
                        ref={register("mobile", { pattern: /^[0-9]{10}$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setMobile(e.target.value); validateMobile(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>
                        {validateMobile(mobile) ? <p>{validateMobile(mobile)}</p> : null}</div>
                    </div>
                  </div>
                </Col>
              </Form.Field>
              </div >
              <div className="col-sm-6">
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}> BloodGroup:</div></label>
                    {/* <div className="mx-5"> */}
                      <label>
                        <select className="select-box" value={BloodGroup} onChange={e => { setBloodGroup(e.target.value); }}>
                          <option value="">Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O-</option>
                          <option value="O-">O-</option>
                        </select>
                      </label>
                    {/* </div> */}
                  </div>
                </Col>
              </Form.Field>
              </div>    
          </div>
          <br/>
          <div className="row">
          <div className="col-sm-6">
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px"}}>Email Id</div></label>
                    <div className="col-sm-7">
                      <input style={{ borderRadius: 40 ,width:"100%" }}
                        className=" mx-4 form-control"
                        type="text"
                        value={email}
                        placeholder="Enter your Email id"
                        ref={register("email", { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                        required
                        autoComplete="off"
                        onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "22%", marginTop: "2%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateEmail(email) ? validateEmail(email) : null}</div>
                    </div>
                  </div>
                </Col>
              </Form.Field>
              </div>
              <div className="col-sm-6">
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}> Marital Status:</div></label>
                    {/* <div className="mx-5"> */}
                      <label>
                        <select value={Maritalstatus} className="select-box" onChange={e => { setMaritalstatus(e.target.value); }}>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </label>
                    {/* </div> */}
                  </div>
                </Col>
              </Form.Field>
              </div>
              </div>
              <br/>
              <div className="row">
              <div className="col-sm-6">
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Address<span style={{color: "red"}}> *</span></div></label>
                    <div className="col-sm-7">
                      <input style={{ borderRadius: 40,width:"100%" }}
                        className=" mx-4 form-control"
                        type="text"
                        value={address}
                        placeholder="Enter your address"
                        ref={register("address", { pattern: /^[0-9/,a-zA-Z- 0-9.]*$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setAddress(e.target.value); validateAddress(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateAddress(address) ? <p>{validateAddress(address)}</p> : null}</div>
                    </div>
                  </div>
                </Col>
              </Form.Field>
              </div>
              <div className="row">
              <div className="col-sm-6">
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Bank Account Number</div></label>
                    <div className="col-sm-7">
                      <input style={{ borderRadius: 40,width:"100%"}}
                        className=" mx-4 form-control"
                        type="text"
                        value={bankaccnum}
                        placeholder="Enter your Bank account number"
                        ref={register("bankaccnum", { pattern: /^[0-9]{9,18}$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setBankAccNum(e.target.value); validateBankAccNum(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "6%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateBankAccNum(bankaccnum) ? <p>{validateBankAccNum(bankaccnum)}</p> : null}</div>
                    </div>
                  </div>
                </Col>
              </Form.Field>
              </div>
              <div className="col-sm-6">
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Salary</div></label>
                    <div className="col-sm-7">
                      <input style={{ borderRadius: 40,width:"100%"}}
                        className=" mx-4 form-control"
                        type="text"
                        value={salary}
                        placeholder="Enter your Salary"
                        ref={register("salary", { pattern: /^\d+$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setSalary(e.target.value); validateSalary(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "6%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateSalary(salary) ? <p>{validateSalary(salary)}</p> : null}</div>
                    </div>
                  </div>
                </Col>
              </Form.Field>
              </div>
              </div>
              <div className="col-sm-6">
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Department:</div></label>
                    {/* <div className="col-sm-7"> */}
                      <select className="w-60 mx-4" form-control style={{ borderRadius: 40 }} value={selectedDepartment} onChange={handleChange}>
                        <option style={{ textAlign: "center" }} value="" disabled>Select department</option>
                        {DEPARTMENT_OPTIONS.map((department, index)=> (
                          <option style={{ textAlign: "center" }} key={index} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    {/* </div> */}
                  </div>
                </Col>
              </Form.Field>
              {selectedDepartment === "DOCTOR" && (
                <Form.Field>
                  <Col>
                    <div className="mb-3">
                      <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>TnmcNo</div></label>
                      <div className="col-sm-7">
                        <input style={{ borderRadius: 40 ,width:"100%"}}
                          className="mx-4 form-control"
                          type="text"
                          placeholder="Enter your TnmcNo"
                          ref={register("TNMCNO")}
                          required
                          autoComplete="off"
                          onChange={e => { setTNMCNO(e.target.value); }}
                        />
                      </div>
                    </div>
                  </Col>
                </Form.Field>
              )}
              {selectedDepartment === "NURSE" && (
                <Form.Field>
                  <Col>
                    <div className="mb-3">
                      <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>RnrNo</div></label>
                      <div className="col-sm-7">
                        <input style={{ borderRadius: 40 ,width:"100%"}}
                          className=" mx-4 form-control"
                          type="text"
                          placeholder="Enter your RnrNo"
                          ref={register("RNRNO")}
                          required
                          autoComplete="off"
                          onChange={e => { setRNRNO(e.target.value); }}
                        />
                      </div>
                    </div>
                  </Col>
                </Form.Field>
              )}
              {selectedDepartment === "NURSE" && (
                <Form.Field>
                  <Col>
                    <div className="mb-3">
                      <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>ValidlityDate</div></label>
                      <div className="col-sm-7">
                        <input style={{ borderRadius: 40 ,width:"100%"}}
                          className=" mx-4 form-control"
                          type="text"
                          placeholder="Enter your ValidlityDate"
                          ref={register("ValidlityDate")}
                          required
                          autoComplete="off"
                          onChange={e => { setValidlityDate(e.target.value); }}
                        />
                      </div>
                    </div>
                  </Col>
                </Form.Field>
                )}
                </div>
                </div>
                <br/>
                <div className="row">
               <div className="col-sm-6">   
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Designation<span style={{color: "red"}}> *</span></div></label>
                    <div className="col-sm-7">
                      <input style={{ borderRadius: 40,width:"100%" }}
                        className=" mx-4 form-control"
                        type="text"
                        value={designation}
                        placeholder="Enter your designation"
                        ref={register("designation", { pattern: /^[a-zA-Z]*$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setDesignation(e.target.value); validateDesignation(e.target.value); }}
                      />
                     <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateDesignation(designation) ? <p>{validateDesignation(designation)}</p> : null}</div>
                    </div>
                  </div>
                </Col>
               </Form.Field>
              </div>   
             
              <div className="col-sm-6">
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Languages Known</div></label>
                    <div className="col-sm-7">
                      <input style={{ borderRadius: 40,width:"100%" }}
                        className=" mx-4 form-control"
                        type="text"
                        value={languages}
                        placeholder="Enter languages known"
                        ref={register("languages", { pattern: /^[a-zA-Z]+(,[a-zA-Z]+)*$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setLanguages(e.target.value); validateLanguages(e.target.value); }}
                      />
                      {languagesError && (
                      <div
                        style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace: "nowrap", fontSize: "12px" }}
                      >
                        {languagesError}
                      </div>
                    )}
                    </div>
                  </div>
                </Col>
               </Form.Field>
              </div>
              </div>
  
              <br/>
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className=" mx-3 form-label">
                      <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Gender</div>
                    </label>
                    {/* <div> */}
                      <Radio className="mx-5"
                        label='Male'
                        name='gender'
                        value='male'
                        checked={Gender === 'male'}
                        onChange={e => { setGender(e.target.value); }}
                      />
                      <Radio className="mx-5"
                        label=' Female'
                        name='gender'
                        value='female'
                        checked={Gender === 'female'}
                        onChange={e => { setGender(e.target.value); }}
                      ></Radio>   
                    {/* </div> */}
                  </div>
                </Col>  
                <button onClick={nextPage} className="next-button">
                <i className="fa fa-arrow-right"></i>
              </button>
              </Form.Field>
              </div>
             )}
          
              {page === 2 && (
               <div>
                <div className="row">
                <div className="col-sm-6">   
                <Form.Field>
                <Col>
                  <div className="mb-3">
                  <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Aadhaarno<span style={{color: "red"}}> *</span></div></label>
                    <div className="col-sm-7">
                    <input style={{ borderRadius: 40 ,width:"100%"}}
                          className="mx-4 form-control"
                          type="text"
                          value={Aadhaarno}
                          placeholder="Enter your Aadhaarno"
                          ref={register("Aadhaarno")}
                          required // add this attribute to make Aadhaar number a mandatory field
                          autoComplete="off"
                          onChange={e => { setAadhaarno(e.target.value);validateAadhaarNo(e.target.value);}}
                        />
                      <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateAadhaarNo(Aadhaarno) ? <p>{validateAadhaarNo(Aadhaarno)}</p> : null}</div>
                    </div>
                  </div>
                </Col>
              </Form.Field>
              </div>
              <br />
                <div className="col-sm-6">
        <div className="mx-5 form-group">
          <input
            id="selectFile"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            hidden
            name="proof"
          />
          <b>Choose PAN or Aadhaar proof:</b>
          <label
            htmlFor="selectFile"
            className="mx-4 bi bi-folder-check"
            style={{
              fontSize: "40px",
              color: "#00A693",
              opacity: "9.9",
              WebkitTextStroke: "2.0px",
              cursor: "pointer",
            }}
          ></label>
          {proofFile && (
            <>
              <span className="mx-3">{proofFile.name}</span>
              <button className="btn btn-danger" onClick={handleRemoveFile}>
                <i className="fa fa-times"></i>
              </button>
            </>
          )}
        </div>
      </div>
              </div>
              <br/>
                <div className="row">
                <div className="col-sm-6"> 
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>PAN No:</div></label>
                    <div className="col-sm-7">
                      <input style={{ borderRadius: 40,width:"100%"}}
                        className="mx-4 form-control"
                        type="text"
                        value={PanNo}
                        placeholder="Enter your PAN No"
                        ref={register("PanNo", { pattern: /^[A-Z0-9]*$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setPanNo(e.target.value);validatePanNo(e.target.value);  }}
                      />
                       <div style={{ color: "red", marginLeft: "8%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validatePanNo(PanNo) ? <p>{validatePanNo(PanNo)}</p> : null}</div>
                    </div>
                  </div>
                </Col>
              </Form.Field>
              </div>
              <br/>
 <div className="col-sm-6">
  <div className="mx-5 form-group">
    <input
      id="formFileMultiple"
      type="file"
      accept=".pdf"
      onChange={handleFileChange}
      multiple
      hidden
      name="certificates"
    />
    <b>Choose Certificates (multiple file select):</b>
    <label
      htmlFor="formFileMultiple"
      className="mx-4 bi bi-folder-plus"
      style={{
        fontSize: "40px",
        color: "#00A693",
        opacity: "9.9",
        WebkitTextStroke: "2.0px",
        cursor: "pointer",
      }}
    ></label>
    {certificatesFile && (
      <>
        <span className="mx-3">{certificatesFile.name}</span>
        <button className="btn btn-danger" onClick={handleRemoveFile3}>
          <i className="fa fa-times"></i>
        </button>
      </>
    )}
  </div>
</div>

                </div>
              <br/>
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Bank Account Number</div></label>
                    <div className="col-sm-7">
                      <input style={{ borderRadius: 40,width:"50%"}}
                        className=" mx-4 form-control"
                        type="text"
                        value={bankaccnum}
                        placeholder="Enter your Bank account number"
                        ref={register("bankaccnum", { pattern: /^[0-9]{9,18}$/ })}
                        required
                        autoComplete="off"
                        onChange={e => { setBankAccNum(e.target.value); validateBankAccNum(e.target.value); }}
                      />
                      <div style={{ color: "red", marginLeft: "6%", marginTop: "1%", whiteSpace:"nowrap",fontSize:"12px"}}>{validateBankAccNum(bankaccnum) ? <p>{validateBankAccNum(bankaccnum)}</p> : null}</div>
                    </div>
                  </div>
                </Col>
              </Form.Field>
              <br />
              <br/>
              <Form.Field>
                <Col>
                  <div className="mb-3">
                    <label className=" mx-3 form-label"  >
                      <div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Identification Mark</div>
                    </label>
                    <div className="mx-5">
                      <textarea
                        rows="4"
                        cols="50"
                        name="comment"
                        form="usrform"
                        value={IdentificationMark}
                        onChange={e => setIdentificationMark(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </Col>
              </Form.Field>
           <div className="row">
  <div className="col-sm-6"> 
    <div className="mx-5 container" style={{ height: "250px", width: "300px", borderRadius: 40 }}>
      <Webcam style={{ height: "220px", width: "270px", borderRadius: 60 }} audio={false} ref={webcamRef} screenshotFormat="image/jpg" />
    </div>
    <button style={{ marginLeft: "170px", marginTop: "-100px", borderColor: "#B9ADAD" }} className="Click" onClick={Capture}>
      <i className="fa fa-2x fa-camera" aria-hidden="true"></i>
    </button>
    <br /><br />
  </div>

  <div className="col-sm-6">
    <div style={{ marginLeft: "-100px", marginTop: "130px" }}><b>(or)</b></div>

    <Col>
      <div style={{ marginTop:"-60px" }} className="mx-5 form-group">
        <input id="selectImage" type="file" name="imgSrc" onChange={handleFileChange} hidden />
        <b>Choose image:<span style={{ color: "red" }}>*</span></b>
        <label htmlFor="selectImage" className="mx-4 bi bi-cloud-arrow-up" style={{ fontSize: "50px", color: "#00A693", opacity: "9.9", WebkitTextStroke: "2.0px", cursor: "pointer" }}></label>
        {profileImageFile && (
          <>
            <span className="mx-3">{profileImageFile.name}</span>
            <button className="btn btn-danger" onClick={handleRemoveImage}>
              <i className="fa fa-times"></i>
            </button>
          </>
        )}
      </div>
    </Col>
  </div>
</div>
              <br />
            <button onClick={prevPage} className="pre-button">
              <i className="fa fa-arrow-left"></i>
              </button>
              </div>
              )}  
              </Form> 
              </div>  
                )   
              },
              {
              title: "Educational Details",
              content:(
                  <Form onSubmit={handleSubmit(onSubmit)}>
                  <div>
            <div><b>EDUCATIONAL QUALIFICATIONS:</b></div><br />
                <table>
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Degree</th>
                      <th>Major</th>
                      <th>Institution &amp; University</th>
                      <th>% of Marks</th>
                      <th>Class/Division</th>
                      <th>Year of Passing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educationData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.SlNo}</td>
                        <td>{data.degree}</td>
                        <td>
        <input type="text" value={data.major} onChange={(e) => { handleOnChangeeducation(e, index, "major"); validateMajor(e.target.value); }} />
        <div style={{ color: "red" }}>{validateMajor(data.major)}</div>
      </td>
      <td>
        <input type="text" value={data.institution} onChange={(e) => { handleOnChangeeducation(e, index, "institution"); validateInstitution(e.target.value); }} />
        <div style={{ color: "red" }}>{validateInstitution(data.institution)}</div>
      </td>
      <td>
        <input type="text" value={data.marks} onChange={(e) => { handleOnChangeeducation(e, index, "marks"); validateMarks(e.target.value); }} />
        <div style={{ color: "red" }}>{validateMarks(data.marks)}</div>
      </td>
      <td>
        <input type="text" value={data.division} onChange={(e) => { handleOnChangeeducation(e, index, "division"); validateDivision(e.target.value); }} />
        <div style={{ color: "red" }}>{validateDivision(data.division)}</div>
      </td>
      <td>
        <input type="text" value={data.year} onChange={(e) => { handleOnChangeeducation(e, index, "year"); validateYear(e.target.value); }} />
        <div style={{ color: "red" }}>{validateYear(data.year)}</div>
      </td>
      </tr>
       ))}
       </tbody>
       </table>
       </div>
       <br/>
  
       </Form>
       
         )
       },
  
    {
      title: "Experience Details",
        content:(
          <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
     <div><b>EXPERIENCE DETAILS:</b></div><br />
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Name of the Hospital/Organization</th>
                        <th>Designation</th>
                        <th>Last Drawn Salary</th>
                        <th>Location</th>
                        <th>Experience From/To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {experienceData.map((data, index) => (
                        <tr key={index}>
                          <td>{data.SlNo}</td>
                          <td>
                          <input type="text" value={data.organization} onChange={(e) => { handleOnChangeexperience(e, index, "organization"); validateOrganization(e.target.value); }} />
                          <div style={{ color: "red" }}>{validateOrganization(data.organization)}</div>
                          </td>
                          <td>
                          <input type="text" value={data.designation} onChange={(e) => { handleOnChangeexperience(e, index, "designation"); validateDesignation(e.target.value); }} />
                          <div style={{ color: "red" }}>{validateexpDesignation(data.designation)}</div>
                          </td>
                          <td>
                          <input type="text" value={data.lastdrawnsalary} onChange={(e) => { handleOnChangeexperience(e, index, "lastdrawnsalary"); validateLastDrawnSalary(e.target.value); }} />
                          <div style={{ color: "red" }}>{validateLastDrawnSalary(data.lastdrawnsalary)}</div>
                          </td>
                          <td>
                          <input type="text" value={data.location} onChange={(e) => { handleOnChangeexperience(e, index, "location"); validateLocation(e.target.value); }} />
                          <div style={{ color: "red" }}>{validateLocation(data.location)}</div>
                          </td>
                          <td>
                          <input type="text" value={data.experience} onChange={(e) => { handleOnChangeexperience(e, index, "experience"); validateExperience(e.target.value); }} />
                          <div style={{ color: "red" }}>{validateExperience(data.experience)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button class="button25 " onClick={addRow}>Add Row</button>
                   </div>
                   </div>
                  </Form>
            )
      },
      {
        title: "Reference Details",
          content:(
            <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
      <div><b>REFERENCE OF PREVIOUS COMPANY:</b></div><br />
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>References:Name</th>
                        <th>Organization</th>
                        <th>Designation</th>
                        <th>Contact No/Email</th>
                      </tr>
                    </thead>
                    <tbody>
    {referenceData.map((data, index) => (
      <tr key={index}>
        <td>{data.SlNo}</td>
        <td>
          <input
            type="text"
            value={data.references}
            onChange={(e) => {
              handleOnChangeReference(e, index, "references");
              validateReferences(e.target.value);
            }}
          />
          <div style={{ color: "red" }}>{validateReferences(data.references)}</div>
        </td>
        <td>
          <input
            type="text"
            value={data.Organization}
            onChange={(e) => {
              handleOnChangeReference(e, index, "Organization");
              validateReferences(e.target.value);
            }}
          />
          <div style={{ color: "red" }}>{validateReferences(data.Organization)}</div>
        </td>
        <td>
          <input
            type="text"
            value={data.designation}
            onChange={(e) => {
              handleOnChangeReference(e, index, "designation");
              validateReferences(e.target.value);
            }}
          />
          <div style={{ color: "red" }}>{validateReferences(data.designation)}</div>
        </td>
        <td>
    <input
      type="text"
      value={data.ContactNo}
      onChange={(e) => {
        handleOnChangeReference(e, index, "ContactNo");
        validaterefContactNo(e.target.value);
      }}
    />
     <div style={{ color: "red" }}>{validaterefContactNo(data.ContactNo)}</div>
  </td>
      </tr>
    ))}
  </tbody>
   </table>
     <button class="button25 " onClick={handleAddRow}>Add Row</button>
    </div>
    <div>
      <button
        className="button-71 Add-employee-button"
        role="button"
        type="submit"
        onClick={handleCombinedClick} // Use the combined handler for the button click
      >
        ADD EMPLOYEE
      </button>
      <p>{message}</p> 
      {uploadSuccess && <p>Upload successful!</p>}
    </div>


     </div>  
  
     </Form>
      
        )
        
      },
      // <div style={{ marginLeft: "800px", font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }} className="message">{message ? <p>{message}</p> : null}</div>   
 ]

  return (
    <body className="addemp">
      
      <div className="App">
        <VerticalTabs tabs={tabs} />
      </div>
   
    </body>
  );
}
export default Addemp;