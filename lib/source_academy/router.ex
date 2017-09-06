defmodule SourceAcademy.Router do
  use SourceAcademy, :router

  pipeline :browser do
    plug :accepts, ["html"]

    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :browser_auth do
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
    plug SourceAcademy.Plug.AssignCurrentUser
    plug SourceAcademy.Plug.AssignCurrentStudent
  end

  pipeline :device do
    plug SourceAcademy.Plug.AssignNavbarTab, tab: :device
    plug Guardian.Plug.EnsureAuthenticated,
      handler: SourceAcademyWeb.AuthController
  end

  pipeline :game do
    plug SourceAcademy.Plug.AssignNavbarTab, tab: :game
    plug Guardian.Plug.EnsureAuthenticated,
      handler: SourceAcademyWeb.AuthController
  end

  pipeline :playground do
    plug SourceAcademy.Plug.AssignNavbarTab, tab: :playground
  end

  pipeline :admin_auth do
    plug SourceAcademy.Plug.AssignNavbarTab, tab: :admin
    plug Guardian.Plug.EnsurePermissions,
      handler: SourceAcademyWeb.AuthController,
      admin: [:access]
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :api_auth do
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
    plug SourceAcademy.Plug.AssignCurrentUser
    plug SourceAcademy.Plug.AssignCurrentStudent
    plug Guardian.Plug.EnsureAuthenticated,
      handler: SourceAcademyApi.AuthController
  end

  scope "/auth", SourceAcademyWeb do
    pipe_through [:browser, :browser_auth]

    get "/login", AuthController, :login
    get "/logout", AuthController, :logout
    get "/signup", AuthController, :signup
    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
    post "/identity/callback", AuthController, :callback
  end

  scope "/api/v1", SourceAcademyApi, as: :api_v1 do
    pipe_through [:api]

    get "/library", LibraryController, :index
  end

  scope "/api/v1", SourceAcademyApi, as: :api_v1 do
    pipe_through [:api, :api_auth]

    resources "/announcements", AnnouncementController, only: [:index]
    resources "/comments", CommentController, only: [:create]
    resources "/codes", CodeController, only: [:update]

    post "/path/submit_mcq", PathController, :submit_mcq
    post "/path/submit_code", PathController, :submit_code
  end

  scope "/", SourceAcademyWeb do
    pipe_through [:browser, :browser_auth, :game]
    get "/", PageController, :index
    get "/game", PageController, :game
  end

  scope "/", SourceAcademyWeb do
    pipe_through [:browser, :browser_auth, :device]

    get "/inbox", InboxController, :index
    get "/inbox/announcements", InboxController, :announcements
    get "/inbox/due_soon", InboxController, :due_soon
    get "/inbox/feed", InboxController, :feed

    get "/journal", JournalController, :index
    get "/materials", MaterialController, :index
    get "/status", StatusController, :index

    put "/assessments/:id/attempt", AssessmentController, :attempt
    get "/assessments/:id/submit", AssessmentController, :submit
    get "/assessments/:id/briefing", AssessmentController, :briefing
    get "/assessments/:id/q/:order", AssessmentController, :question
  end

  scope "/", SourceAcademyWeb do
    pipe_through [:browser, :browser_auth, :playground]

    get "/playground", PlaygroundController, :index
  end

  scope "/admin", SourceAcademyAdmin, as: :admin do
    pipe_through [:browser, :browser_auth, :admin_auth]

    get "/", PageController, :index

    get "/my_student", PageController, :my_student
    get "/gradings", PageController, :gradings
    get "/path_submissions", PageController, :path_submissions

    resources "/students", StudentController do
      put "/toggle_phantom", StudentController, :toggle_phantom,
        as: :toggle_phantom
      post "/xp_history", StudentController, :create_xp_history,
        as: :xp_history
    end

    resources "/announcements", AnnouncementController, except: [:show] do
      put "/toggle_pin", AnnouncementController, :toggle_pin, as: :toggle_pin
      put "/toggle_publish", AnnouncementController, :toggle_publish, as: :toggle_publish
    end

    resources "/discussion_groups", DiscussionGroupController,
      only: [:index, :create, :delete]

    resources "/achievements", AchievementController, except: [:show]
    get "/achievements/:id/move_up", AchievementController, :move_up
    get "/achievements/:id/move_down", AchievementController, :move_down

    resources "/student_achievements", StudentAchievementController, only: [:new, :create]

    resources "/assessments", AssessmentController do
      put "/publish", AssessmentController, :publish, as: :publish
      get "/submissions", AssessmentController, :submissions, as: :submissions

      get "/submissions/:id/grading", AssessmentController, :edit_grade, as: :grading
      put "/submissions/:id/grading", AssessmentController, :update_grade, as: :grading
      put "/submissions/:id/unsubmit", AssessmentController, :unsubmit, as: :unsubmit

      resources "/questions", QuestionController,
        as: :question,
        only: [:edit, :create, :update, :delete]
      resources "/programming_questions", ProgrammingQuestionController,
        as: :programming_question,
        only: [:edit, :create, :update] do
          resources "/test_cases", TestCaseController,
            only: [:update, :create, :delete]
        end
      resources "/mcq_questions", MCQQuestionController,
        as: :mcq_question,
        only: [:edit, :create, :update] do
          resources "/choices", MCQChoiceController, as: :choices
        end
    end

    resources "/materials", MaterialController,
      only: [:index, :new, :create, :delete]
    post "/material_categories", MaterialController, :create_category
    delete "/material_categories", MaterialController, :delete_category

    resources "/libraries", LibraryController, except: [:show]
  end
end
