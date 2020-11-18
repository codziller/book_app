import React from "react";
import Navbar from "../../Components/Navbar";
import { Table, Button, Input, Form, Label, Spinner } from "reactstrap";
import Quiz from "./Quiz";
import SearchBar from "../../Components/Searchbar";
import Modal from "../../Components/Modal";
import AppSelect from "../../Components/Select";
import { Ellipses } from "../../Components/Icons";
import AuthService from "../../Services/auth.service";
import UserService from "../../Services/user.service";
import ReactPaginate from "react-paginate";
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      userName: "",
      searchQuery: "",
      isOpen: false,
      dropdownOpen: false,
      showCreateModal: false,
      modalType: "",
      showUpdateModal: false,
      tournament: "",
      category: "",
      difficulty: "",
      tournamentSuccess: true,
      first_nameSuccess: true,
      last_nameSuccess: true,
      categorySuccess: true,
      difficultySuccess: true,
      categoryOptions: [],
      difficultyOptions: [
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
      ],
      tournamentList: [],
      allTournamentList: [],
      offset: 0,
      perPage: 3,
      currentPage: 0,
      pageLoading: false,
      categoryLoading: false,
      createLoading: false,
      createText: "Create Tournament",
      updateText: "Update Tournament",
      deleteText: "Yes",
      createColor: "primary",
      error: "",
      showTournaments: true,
      showQuiz: false,
      currentTournament: {},
      currentQuestion: 0,
      selectedOption: "",
      selectedAnswer: {},
      correctAnswers: 0,
      showFinalModal: false,
    };
  }

  async componentDidMount() {
    let auth = JSON.parse(localStorage.getItem("user"));
    if (!auth) {
      this.props.history.push("/login");
    } else {
      await this.handleGetTournaments();
      await this.handleGetCategoryOptions();
      this.setState({
        userId: auth.id,
        userName: auth.first_name + " " + auth.last_name,
      });
    }
  }

  handleGetTournaments = async () => {
    this.setState({ pageLoading: true });
    await UserService.getInfo(null, "/api/quiz-tournaments/")
      .then(async (response) => {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].show = false;
        }

        const slice = response.data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        this.setState({
          pageCount: Math.ceil(response.data.length / this.state.perPage),
          tournamentList: slice,
          allTournamentList: response.data,
        });
      })
      .catch((e) => {
        if (
          (e && e.response && e.response.status === 401) ||
          (e && e.response && e.response.status === 404) ||
          (e && e.response && e.response.status === 403) ||
          (e && e.response && e.response.status === 503)
        ) {
          this.props.history.push("/login");
          AuthService.logout();
        }
        this.setState({ error: e });
      })
      .finally(() => {
        this.setState({ pageLoading: false });
      });
  };

  handleGetCategoryOptions = async () => {
    this.setState({ categoryLoading: true });
    await UserService.getInfo(null, "/api/poll-categories/")
      .then(async (response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.setState((prevState) => ({
            categoryOptions: [
              ...prevState.categoryOptions,
              {
                value:
                  response &&
                  response.data &&
                  response.data[i] &&
                  response.data[i].id,
                label:
                  response &&
                  response.data &&
                  response.data[i] &&
                  response.data[i].category_name,
              },
            ],
          }));
        }
      })
      .catch((e) => {
        if (
          (e && e.response && e.response.status === 401) ||
          (e && e.response && e.response.status === 404) ||
          (e && e.response && e.response.status === 403) ||
          (e && e.response && e.response.status === 503)
        ) {
          this.props.history.push("/login");
          AuthService.logout();
        }
        this.setState({ error: e });
      })
      .finally(() => {
        this.setState({ categoryLoading: false });
      });
  };
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.loadMoreData();
      }
    );
  };

  loadMoreData = () => {
    const data = this.state.allTournamentList;

    const slice = data.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    this.setState({
      pageCount: Math.ceil(data.length / this.state.perPage),
      tournamentList: slice,
    });
  };

  toggle = (state, value, reset) => {
    this.setState({ [state]: value });
    reset &&
      this.setState({
        tournamentSuccess: true,
        categorySuccess: true,
        difficultySuccess: true,
        createText: "Create Tournament",
        updateText: "Update Tournament",
        deleteText: "Yes",
        createColor: "primary",
      });
  };
  toggleActionData = (index, selected) => {
    const values = [...this.state.tournamentList];
    values[index][selected] = !values[index][selected];
    this.setState({ values });
  };
  handleInputChange = (state, value) => {
    this.setState({ [state]: value });
  };
  handleSuccess = () => {
    this.setState((prevState) => ({
      ...prevState,
      tournamentSuccess: false,
      categorySuccess: false,
      difficultySuccess: false,
    }));
  };
  handleFocus = (field) => {
    this.setState((prevState) => ({
      ...prevState,
      [field]: true,
    }));
  };
  handleCreateTournament = async (e) => {
    e.preventDefault();

    if (
      this.state.tournament === "" ||
      this.state.category === "" ||
      this.state.difficulty === ""
    ) {
      this.handleSuccess();
    } else {
      this.setState({ createLoading: true });
      var bodyParameters = {
        difficulty: this.state.difficulty,
        category: this.state.category,
        name: this.state.tournament,
        user: this.state.userId,
      };
      await UserService.formSubmit(bodyParameters, "/api/quiz-tournaments/")
        .then(async () => {
          this.setState({
            createText: "Created",
            createColor: "success",
            createLoading: false,
          });
        })
        .catch((error) => {
          if (
            (error && error.response && error.response.status === 401) ||
            (error && error.response && error.response.status === 404) ||
            (error && error.response && error.response.status === 403) ||
            (error && error.response && error.response.status === 503)
          ) {
            this.props.history.push("/login");
            AuthService.logout();
          }
          this.setState({
            createText: "Error",
            createColor: "danger",
            createLoading: false,
          });
          const err =
            error && (error.response || error.message || error.toString());

          this.setState({ createError: err.data });
        })
        .finally(async () => {
          await this.handleGetTournaments();
        });
    }
  };

  handleUpdateTournament = async (e) => {
    e.preventDefault();

    if (
      this.state.tournament === "" ||
      this.state.category === "" ||
      this.state.difficulty === ""
    ) {
      this.handleSuccess();
    } else {
      this.setState({ createLoading: true });
      var bodyParameters = {
        difficulty: this.state.difficulty,
        category: this.state.category,
        name: this.state.tournament,
        user: this.state.userId,
      };
      await UserService.formPatch(
        bodyParameters,
        `/api/quiz-tournaments/${this.state.currentTournament.id}/`
      )
        .then(async () => {
          this.setState({
            updateText: "Updated",
            createColor: "success",
            createLoading: false,
          });
        })
        .catch((error) => {
          if (
            (error && error.response && error.response.status === 401) ||
            (error && error.response && error.response.status === 404) ||
            (error && error.response && error.response.status === 403) ||
            (error && error.response && error.response.status === 503)
          ) {
            this.props.history.push("/login");
            AuthService.logout();
          }
          this.setState({
            updateText: "Error",
            createColor: "danger",
            createLoading: false,
          });
          const err =
            error && (error.response || error.message || error.toString());

          this.setState({ createError: err.data });
        })
        .finally(async () => {
          await this.handleGetTournaments();
        });
    }
  };

  handleDeleteTournament = async () => {
    this.setState({ pageLoading: true, deleteText: "Deleting" });

    await UserService.deleteInfo(
      `/api/quiz-tournaments/${this.state.currentTournament.id}/`
    )
      .then(async () => {
        this.setState({
          deleteText: "Deleted",
        });
      })
      .catch((error) => {
        if (
          (error && error.response && error.response.status === 401) ||
          (error && error.response && error.response.status === 404) ||
          (error && error.response && error.response.status === 403) ||
          (error && error.response && error.response.status === 503)
        ) {
          this.props.history.push("/login");
          AuthService.logout();
        }
        this.setState({
          deleteText: "Error",
          pageLoading: false,
        });
        const err =
          error && (error.response || error.message || error.toString());

        this.setState({ createError: err.data });
      })
      .finally(async () => {
        await this.handleGetTournaments();
      });
  };
  renderViews = (name) => {
    switch (name) {
      case "showTournaments":
        window.scrollTo({
          top: 0,
        });
        this.setState({
          showTournaments: true,
          showQuiz: false,
        });
        break;
      case "showQuiz":
        window.scrollTo({
          top: 0,
        });
        this.setState({
          showQuiz: true,
          showTournaments: false,
        });
        break;
      default:
        this.setState({
          showTournaments: true,
          showQuiz: false,
        });
    }
  };
  handleAnswerSelect = (item) => {
    this.setState({ selectedOption: item });
  };
  handleNext = () => {
    if (this.state.currentQuestion <= 9) {
      this.setState({ currentQuestion: this.state.currentQuestion + 1 });

      if (this.state.selectedAnswer.correct_answer) {
        this.setState({ correctAnswers: this.state.correctAnswers + 1 });
      }
      this.setState({ selectedAnswer: {}, selectedOption: "" });
    } else {
      return;
    }
  };

  finishQuiz = () => {
    this.setState({ showFinalModal: !this.state.showFinalModal });
    this.setState({
      currentQuestion: 0,
      correctAnswers: 0,
      selectedOption: "",
      selectedAnswer: {},
    });
    this.renderViews("showTournaments");
  };
  render() {
    const {
      userName,
      isOpen,
      showCreateModal,
      tournamentList,
      categoryOptions,
      difficultyOptions,
      showTournaments,
      showQuiz,
      currentTournament,
      currentQuestion,
      selectedOption,

      correctAnswers,
      modalType,
    } = this.state;
    return (
      <div className="home_page_container">
        <Navbar
          isOpen={isOpen}
          toggleClick={() => this.toggle("isOpen", !this.state.isOpen)}
          navClick={() => {
            AuthService.logout();
            this.props.history.push("/login");
          }}
          navigation="Logout"
          color="danger"
        />

        {showTournaments && (
          <div className="home_body">
            <div className="home_section_one">
              <Button
                className="create_button"
                color="success"
                size="md"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  this.toggle(
                    "showCreateModal",
                    !this.state.showCreateModal,
                    true
                  );
                }}
              >
                <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                  +
                </span>
                <h6>Create Tournament</h6>
              </Button>
              <SearchBar
                value={this.state.searchQuery}
                onChange={(e) =>
                  this.handleInputChange("searchQuery", e.target.value)
                }
              />
            </div>
            <div className="table_container">
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Creator</th>
                    <th>Tournament Name</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tournamentList
                    .filter((item) => {
                      if (this.state.searchQuery === "") {
                        return item;
                      } else if (
                        `${
                          item &&
                          item.creator &&
                          item.creator.first_name.toLowerCase() +
                            " " +
                            item.creator.last_name.toLowerCase()
                        }`.includes(this.state.searchQuery.toLowerCase()) ||
                        (item &&
                          item.category &&
                          item.category.category_name
                            .toLowerCase()
                            .includes(this.state.searchQuery.toLowerCase())) ||
                        item.name
                          .toLowerCase()
                          .includes(this.state.searchQuery.toLowerCase()) ||
                        item.difficulty
                          .toLowerCase()
                          .includes(this.state.searchQuery.toLowerCase())
                      ) {
                        return item;
                      }
                    })

                    .map((item, i) => {
                      return (
                        <tr key={"tournament" + i}>
                          <th scope="row">{item.id}</th>
                          <td>
                            {item &&
                              item.creator &&
                              item.creator.first_name +
                                " " +
                                item.creator.last_name}
                          </td>
                          <td>{item.name}</td>
                          <td>
                            {item &&
                              item.category &&
                              item.category.category_name}
                          </td>
                          <td>{item.difficulty}</td>
                          <td className="table_actions">
                            <Ellipses
                              width="0.8em"
                              height="0.8em"
                              fill="#17a3b83a"
                              className="ellipses"
                              onClick={() => this.toggleActionData(i, "show")}
                            />
                            {item.show && (
                              <div className="action_modal">
                                <h6
                                  onClick={() =>
                                    this.toggleActionData(i, "show")
                                  }
                                >
                                  x
                                </h6>
                                <button
                                  onClick={async () => {
                                    await this.setState({
                                      currentTournament: item,
                                    });
                                    this.renderViews("showQuiz");
                                  }}
                                >
                                  Open Tournament
                                </button>
                                <button
                                  onClick={async () => {
                                    await this.setState({
                                      modalType: "update",
                                      currentTournament: item,
                                      tournament: item.name,
                                      category: item.category.id,
                                      difficulty: item.difficulty,
                                    });
                                    this.toggle(
                                      "showCreateModal",
                                      !this.state.showCreateModal,
                                      true
                                    );
                                  }}
                                >
                                  Update Tournament
                                </button>
                                <button
                                  onClick={async () => {
                                    await this.setState({
                                      modalType: "delete",
                                      currentTournament: item,
                                    });
                                    this.toggle(
                                      "showCreateModal",
                                      !this.state.showCreateModal,
                                      true
                                    );
                                  }}
                                >
                                  Delete Tournament
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              {tournamentList.length !== 0 && (
                <ReactPaginate
                  previousLabel={"previous"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              )}
            </div>
          </div>
        )}
        {showQuiz && (
          <Quiz
            index={(currentQuestion < 10 && currentQuestion + 1) || "---"}
            question={
              currentTournament &&
              currentTournament.questions &&
              currentTournament.questions.map((item, i) => {
                if (i === currentQuestion) {
                  return <h6 key={"question" + i}>{item.question_text}</h6>;
                }
              })
            }
            options={
              currentTournament &&
              currentTournament.questions[currentQuestion] &&
              currentTournament.questions[currentQuestion].choice_text.map(
                (item, i) => {
                  return (
                    <button
                      key={"option" + i}
                      className={`single_option ${
                        (selectedOption.includes(item.choice_text) &&
                          "single_option_active") ||
                        ""
                      }`}
                      onClick={() => {
                        this.handleAnswerSelect(item.choice_text);
                        this.setState({ selectedAnswer: item });
                      }}
                    >
                      <h6>{item.choice_text}</h6>
                    </button>
                  );
                }
              )
            }
            backClick={() => {
              this.renderViews("showTournaments");
            }}
            nextClick={this.handleNext}
            nextDisabled={currentQuestion === 11}
          />
        )}
        <Modal
          modal={currentQuestion === 10}
          toggle={this.finishQuiz}
          className="result_modal"
          showHeader
          title="Quiz Result"
          body={
            <div>
              <h6>Your score</h6>
              <h6 style={{ color: "#17a2b8", fontSize: "24px" }}>
                {((correctAnswers / 10) * 100 &&
                  (correctAnswers / 10) * 100 + "%") ||
                  "0%"}
              </h6>

              <div>
                {currentTournament &&
                  currentTournament.questions &&
                  currentTournament.questions.map((item, i) => {
                    return (
                      <div key={"item" + i}>
                        <Label>{`Question ${i + 1}`}</Label>
                        <h6> {item.question_text}</h6>
                        <Label>Options</Label>
                        <div>
                          {item.choice_text.map((item, i) => {
                            return (
                              <button
                                key={"option" + i}
                                className={`single_option ${
                                  (item.correct_answer &&
                                    "single_option_correct") ||
                                  ""
                                }`}
                              >
                                <h6>{item.choice_text}</h6>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
              <Button
                color="info"
                block
                className="mt-3"
                onClick={this.finishQuiz}
              >
                Finish
              </Button>
            </div>
          }
        />

        <Modal
          modal={showCreateModal}
          toggle={() => {
            this.toggle("showCreateModal", !this.state.showCreateModal, true);
            this.setState({
              modalType: "",
              tournament: "",
              category: "",
              difficulty: "",
            });
          }}
          className="form_modal"
          title={
            (modalType === "update" && "Update Quiz Tournament") ||
            (modalType === "delete" && "Delete Tournament") ||
            "Create Quiz Tournament"
          }
          showHeader={true}
          body={
            (modalType === "delete" && (
              <div>
                <h6>
                  Are you sure you want to delete
                  {" " + this.state.currentTournament.name}
                </h6>
                <div className="delete_prompt_container">
                  <Button
                    color="danger"
                    size="sm"
                    disabled={this.state.pageLoading}
                    onClick={() => {
                      this.handleDeleteTournament();
                      this.setState({ showCreateModal: false });
                    }}
                  >
                    {this.state.deleteText}
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      this.setState({
                        showCreateModal: false,
                        currentTournament: {},
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )) || (
              <Form
                className="create_form"
                onSubmit={
                  (modalType === "update" && this.handleUpdateTournament) ||
                  this.handleCreateTournament
                }
              >
                <h6 className="error_text" style={{ height: "16px" }}>
                  {this.state.createError}
                </h6>
                <Input
                  type="name"
                  disabled
                  className={
                    (this.state.last_nameSuccess && "mb-3") ||
                    "mb-3 error_input"
                  }
                  value={
                    modalType === "update"
                      ? currentTournament.creator.first_name +
                        " " +
                        currentTournament.creator.last_name
                      : userName
                  }
                  style={{ textTransform: "capitalize" }}
                />
                <Input
                  type="name"
                  placeholder="Enter tournament name"
                  className={
                    (this.state.categorySuccess && "mb-3") || "mb-3 error_input"
                  }
                  value={this.state.tournament}
                  onChange={(e) =>
                    this.handleInputChange("tournament", e.target.value)
                  }
                  onFocus={() => this.handleFocus("tournamentSuccess")}
                />
                {/* <Input
                type="name"
                placeholder="Enter creator's first name"
                className={
                  (this.state.first_nameSuccess && "mb-3") || "mb-3 error_input"
                }
                value={this.state.first_name}
                onChange={(e) =>
                  this.handleInputChange("first_name", e.target.value)
                }
                onFocus={() => this.handleFocus("first_nameSuccess")}
              />
              <Input
                type="name"
                placeholder="Enter creator's last name"
                className={
                  (this.state.last_nameSuccess && "mb-3") || "mb-3 error_input"
                }
                value={this.state.last_name}
                onChange={(e) =>
                  this.handleInputChange("last_name", e.target.value)
                }
                onFocus={() => this.handleFocus("last_nameSuccess")}
              /> */}

                <AppSelect
                  defaultInputValue={
                    (modalType === "update" &&
                      currentTournament.category.category_name) ||
                    ""
                  }
                  placeholder="Select Category"
                  options={categoryOptions}
                  handleChange={(e) =>
                    this.handleInputChange("category", e.value)
                  }
                  onFocus={() => this.handleFocus("categorySuccess")}
                  className={
                    (this.state.categorySuccess && "sucess_select") ||
                    "error_select"
                  }
                />
                <AppSelect
                  defaultInputValue={
                    (modalType === "update" && currentTournament.difficulty) ||
                    ""
                  }
                  placeholder="Select Difficulty"
                  options={difficultyOptions}
                  handleChange={(e) =>
                    this.handleInputChange("difficulty", e.value)
                  }
                  onFocus={() => this.handleFocus("difficultySuccess")}
                  className={
                    (this.state.difficultySuccess && "sucess_select") ||
                    "error_select"
                  }
                />

                <Button
                  type="submit"
                  className="mb-4 mt-4"
                  color={this.state.createColor}
                  disabled={this.state.createLoading}
                  size="sm"
                  block
                >
                  {(modalType === "update" && this.state.updateText) ||
                    this.state.createText}
                  {this.state.createLoading && (
                    <Spinner color="light" size="sm" className="ml-1" />
                  )}
                </Button>
              </Form>
            )
          }
        />
      </div>
    );
  }
}
