import React from "react";
import Navbar from "../../Components/Navbar";
import { Table, Button, Input, Form, Label, Spinner } from "reactstrap";
import Quiz from "./Quiz";
import SearchBar from "../../Components/Searchbar";
import Modal from "../../Components/Modal";
import AppSelect from "../../Components/Select";
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
      book: "",
      difficulty: "",
      currentCategory: [],
      tournamentSuccess: true,
      first_nameSuccess: true,
      last_nameSuccess: true,
      categorySuccess: true,
      difficultySuccess: true,
      categoryOptions: [],
      bookStoreList: [],
      allbookStoreList: [],
      bookOptions: [],
      offset: 0,
      perPage: 100,
      currentPage: 0,
      pageLoading: false,
      categoryLoading: false,
      createLoading: false,
      createText: "Borrow",
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
      await this.handleGetCategoryOptions();
      await this.setState({
        userId: auth.id,
        userName: auth.first_name + " " + auth.last_name,
      });
      await this.handleGetTournaments();
    }
  }

  handleGetTournaments = async () => {
    await UserService.getInfo(null, `/api/rented-books/${this.state.userId}`)
      .then(async (response) => {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].show = true;
        }
        const slice = response.data["rented_books"].slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        this.setState({
          pageCount: Math.ceil(response.data.length / this.state.perPage),
          bookStoreList: slice,
          allbookStoreList: response.data["rented_books"],
          total_fee: response.data["total_fee"],
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
    await UserService.getInfo(null, "/api/category")
      .then(async (response) => {
        this.setState({ currentCategory: response.data });
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
                  response.data[i].name,
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
    const data = this.state.allbookStoreList;
    const slice = data.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    this.setState({
      pageCount: Math.ceil(data.length / this.state.perPage),
      bookStoreList: slice,
    });
  };

  toggle = (state, value, reset) => {
    this.setState({ [state]: value });
    reset &&
      this.setState({
        tournamentSuccess: true,
        categorySuccess: true,
        difficultySuccess: true,
        createText: "Borrow !",
        updateText: "Update Tournament",
        deleteText: "Yes",
        createColor: "primary",
      });
  };
  toggleActionData = (index, selected) => {
    const values = [...this.state.bookStoreList];
    values[index][selected] = !values[index][selected];
    this.setState({ values });
  };
  showBookSelect = () => {
    let bookOptions = [];
    for (
      let i = 0;
      i <
      this.state.currentCategory[this.state.category - 1].book_category.length;
      i++
    ) {
      bookOptions.push({
        value:
          this.state.currentCategory &&
          this.state.currentCategory &&
          this.state.currentCategory[this.state.category - 1].book_category[i]
            .id,
        label:
          this.state.currentCategory &&
          this.state.currentCategory[this.state.category - 1] &&
          this.state.currentCategory[this.state.category - 1].book_category[i]
            .name,
      });
    }
    this.setState({ bookOptions });
  };
  handleInputChange = async (state, value, isCategory) => {
    await this.setState({ [state]: value });
    isCategory && this.showBookSelect();
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

    if (this.state.book === "") {
      this.handleSuccess();
    } else {
      this.setState({ createLoading: true });
      var bodyParameters = {
        book: this.state.book,
        customer: this.state.userId,
      };
      await UserService.formSubmit(bodyParameters, "/api/lend-book/")
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
          this.setState({ createError: err.data.error[0] });
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
        `/api/quiz-tournaments/${this.state.currentTournament.id}`
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

  render() {
    const {
      userName,
      isOpen,
      showCreateModal,
      bookStoreList,
      categoryOptions,
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
                <h6>Borrow new book!</h6>
              </Button>
              <SearchBar
                value={this.state.searchQuery}
                onChange={(e) =>
                  this.handleInputChange("searchQuery", e.target.value)
                }
              />
            </div>
            <h5 style={{ color: "lightblue" }}>
              <center>Hi, {this.state.userName}</center>
            </h5>
            <h5 style={{ color: "lightblue" }}>
              <center>
                Your total outstanding charge is: ${this.state.total_fee}
              </center>
            </h5>
            <h6 className="table_container-text">
              <center>BOOKS YOU BORROWED</center>
            </h6>
            <div className="table_container">
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Book Name</th>
                    <th>Category</th>
                    <th>Date Borrowed</th>
                    <th>Unit Charge</th>
                    <th>Accumulated Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {bookStoreList
                    .filter((item) => {
                      if (this.state.searchQuery === "") {
                        return item;
                      } else if (
                        `${
                          item && item.book && item.book.name.toLowerCase()
                        }`.includes(this.state.searchQuery.toLowerCase()) ||
                        (item &&
                          item.book.category &&
                          item.book.category.name
                            .toLowerCase()
                            .includes(this.state.searchQuery.toLowerCase()))
                      ) {
                        return item;
                      }
                      return true;
                    })

                    .map((item, i) => {
                      return (
                        <tr key={"tournament" + i}>
                          <th scope="row">{item.book.name}</th>
                          <td>{item.book.category.name}</td>
                          <td>{item.date_logged.slice(0, 10)}</td>
                          <td>${item.book.category.price.toFixed(1)}</td>
                          <td>${item.rental_charge.toFixed(1)}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              {bookStoreList.length !== 0 && (
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
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
                return true;
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
            "Borrow a Book"
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
                <AppSelect
                  defaultInputValue={
                    (modalType === "update" &&
                      currentTournament.category.category_name) ||
                    ""
                  }
                  placeholder="Select Category"
                  options={categoryOptions}
                  handleChange={(e) =>
                    this.handleInputChange("category", e.value, true)
                  }
                  onFocus={() => this.handleFocus("categorySuccess")}
                  className={
                    (this.state.categorySuccess && "sucess_select") ||
                    "error_select"
                  }
                />
                {this.state.category && (
                  <AppSelect
                    defaultInputValue={
                      (modalType === "update" &&
                        currentTournament.difficulty) ||
                      ""
                    }
                    placeholder="Choose Books"
                    options={this.state.bookOptions}
                    handleChange={(e) =>
                      this.handleInputChange("book", e.value)
                    }
                    onFocus={() => this.handleFocus("difficultySuccess")}
                    className={
                      (this.state.difficultySuccess && "sucess_select") ||
                      "error_select"
                    }
                  />
                )}

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

// export default withRouter(Home);
