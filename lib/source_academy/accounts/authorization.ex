defmodule SourceAcademy.Accounts.Authorization do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Accounts.User

  schema "authorizations" do
    field :provider, :string
    field :uid, :string
    field :token, :string
    field :refresh_token, :string
    field :expires_at, :integer

    field :first_name, :string, virtual: true
    field :last_name, :string, virtual: true, default: ''
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true

    belongs_to :user, User

    timestamps()
  end

  @required_fields ~w(provider uid token)a
  @optional_fields ~w(refresh_token expires_at)a
  @required_identity_registration_fields ~w(password password_confirmation)a

  def identity_registration_changeset(auth, params) do
    auth
    |> cast(params, @required_identity_registration_fields)
    |> validate_required(@required_identity_registration_fields)
  end

  def changeset(authorization, params \\ :empty) do
    authorization
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> foreign_key_constraint(:uid)
    |> unique_constraint(:uid)
  end
end
