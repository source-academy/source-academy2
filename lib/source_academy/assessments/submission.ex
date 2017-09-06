defmodule SourceAcademy.Assessments.Submission do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Course.Student
  alias SourceAcademy.Accounts.User
  alias SourceAcademy.Assessments.Assessment
  alias SourceAcademy.Assessments.SubmissionStatus
  alias SourceAcademy.Assessments.ProgrammingAnswer

  schema "submissions" do
    field :status, SubmissionStatus, default: :attempting
    field :submitted_at, Timex.Ecto.DateTime
    field :override_xp, :integer

    belongs_to :student, Student
    belongs_to :grader, User
    belongs_to :assessment, Assessment

    has_many :programming_answers, ProgrammingAnswer

    timestamps()
  end

  @required_fields ~w(status)a
  @optional_fields ~w(override_xp submitted_at)a

  def changeset(submission, params) do
    params = convert_date(params, "submitted_at")
    submission
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
  end
end
