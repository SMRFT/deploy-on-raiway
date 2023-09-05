import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Header from "./Header";
import "./Viewemp.css";

const TrashPage = () => {
  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    loadDeletedEmployees();
  }, []);

  const loadDeletedEmployees = () => {
    axios
      .get("http://127.0.0.1:7000/attendance/deleted-employees/")
      .then((res) => {
        setDeletedEmployees(res.data);
        const pendingDeletionCount = res.data.length;
        localStorage.setItem("pendingDeletionCount", pendingDeletionCount);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteEmployee = async (id) => {
    setSelectedEmployeeId(id);
    setShowDeleteModal(true);
  };

  const restoreEmployee = async (id) => {
    setSelectedEmployeeId(id);
    setShowRestoreModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    try {
      await fetch("http://127.0.0.1:7000/attendance/permanentdelete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: selectedEmployeeId,
        }),
      });

      // Remove the deleted employee from the state without refreshing
      setDeletedEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== selectedEmployeeId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestoreConfirm = async () => {
    setShowRestoreModal(false);
    try {
      await fetch(`http://127.0.0.1:7000/attendance/restore-employee/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: selectedEmployeeId }),
      });

      // Remove the restored employee from the state without refreshing
      setDeletedEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== selectedEmployeeId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <br />
      <div className="viewemp">
        <div className="row">
          {deletedEmployees.map((employee) => (
            <div
              className="col-md-3 mb-3"
              key={employee.id}
              style={{ borderRadius: "5px" }}
            >
              <Card
                md={4}
                className="employee"
              >
                <Card.Body
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    marginRight: "4%",
                  }}
                >
                  <img
                    src={`http://127.0.0.1:7000/attendance/get_file?filename=${employee.name}_${employee.id}_profile.jpg`}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      marginTop: "-8%",
                    }}
                    alt="Profile Picture"
                  />
                  <br />
                  <div>
                    <div
                      style={{
                        color: "#525E75",
                        fontWeight: "bold",
                        fontFamily: "'Latobold', sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {employee.id} - {employee.name}
                    </div>
                    <div
                      style={{
                        color: "#BFBFBF",
                        fontFamily: "'LatoWeb', sans-serif",
                        fontSize: "13px",
                      }}
                    >
                      {employee.designation}
                    </div>
                    <div
                      style={{
                        color: "#525E75",
                        fontFamily: "'LatoWeb', sans-serif",
                        fontSize: "13px",
                      }}
                    >
                      {employee.email}
                    </div>
                    <br />
                    <div style={{ marginTop: "auto" }}>
                      <button
                        onClick={() => deleteEmployee(employee.id)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          padding: "6px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => restoreEmployee(employee.id)}
                        style={{
                          backgroundColor: "#90EE90",
                          color: "black",
                          padding: "6px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header style={{ padding: "2%",fontFamily:"serif" }} closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this employee?</Modal.Body>
        <Modal.Footer style={{ padding: "1%" }}>
          <Button
            style={{ padding: "1%",fontFamily:"serif" }}
            variant="danger"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRestoreModal}
        onHide={() => setShowRestoreModal(false)}
      >
        <Modal.Header style={{ padding: "2%" }} closeButton>
          <Modal.Title>Confirm Restore</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to restore this employee?</Modal.Body>
        <Modal.Footer style={{ padding: "1%" }}>
          <Button
            style={{ padding: "1%" }}
            variant="success"
            onClick={handleRestoreConfirm}
          >
            Restore
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TrashPage;