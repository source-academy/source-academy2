defmodule SourceAcademy.Repo.Migrations.FixProgrammingAnswer do
  @moduledoc false
  use Ecto.Migration

  def change do
    rename table(:assessment_programming_answers),
      :submission, to: :submission_id

    rename table(:assessment_programming_answers),
      :question, to: :question_id

    rename table(:assessment_programming_answers),
      :code, to: :code_id
  end
end
