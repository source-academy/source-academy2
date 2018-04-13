defmodule SourceAcademy.Workspace.Code do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Accounts.User

  schema "codes" do
    field :title, :string, default: ""
    field :content, :string, default: "\n"
    field :is_public, :boolean, default: false
    field :is_readonly, :boolean, default: false

    belongs_to :owner, User

    timestamps()
  end

  @required_fields ~w()a
  @optional_fields ~w(title content is_public is_readonly)a

  def changeset(code, params \\ :empty) do
    code
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
  end
end
