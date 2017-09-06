defmodule SourceAcademy.Assessments.MCQChoice do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Assessments.MCQQuestion

  @default_content String.trim("""
Type the content of the question here
""")

  @default_hint String.trim("""
Type the hint of the choice here.
Shown when student chooses this choice, correct or not
  """)

  schema "assessment_mcq_choices" do
    field :content, :string, default: @default_content
    field :hint, :string, default: @default_hint
    field :is_correct, :boolean, default: false

    belongs_to :mcq_question, MCQQuestion

    timestamps()
  end

  @required_fields ~w()a
  @optional_fields ~w(content hint is_correct)a

  def changeset(choice, params) do
    choice
    |> cast(params, @required_fields ++ @optional_fields)
  end
end
