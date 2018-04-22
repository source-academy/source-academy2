defmodule SourceAcademy.Assessments.SaveHistory do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Assessments.ProgrammingQuestion
  alias SourceAcademy.Assessments.Submission
  alias SourceAcademy.Workspace.Code

  schema "assessment_save_history" do

    belongs_to :submission, Submission
    belongs_to :question, ProgrammingQuestion
    has_many :codes, Code, on_delete: :delete_all
  end

  @required_fields ~w()a
  @optional_fields ~w()a

  def changeset(answer, params) do
    answer
    |> cast(params, @required_fields ++ @optional_fields)
  end
end
