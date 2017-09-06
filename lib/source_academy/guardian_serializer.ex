defmodule SourceAcademy.GuardianSerializer do
  @moduledoc """
    Convert token to user and vice versa.
  """
  @behaviour Guardian.Serializer

  alias SourceAcademy.Repo
  alias SourceAcademy.Accounts.User

  def for_token(%User{} = user), do: {:ok, "User:#{user.id}"}
  def for_token(_), do: {:error, "Unknown resource type"}

  def from_token("User:" <> id), do: {:ok, Repo.get(User, id)}
  def from_token(_), do: {:error, "Unknown resource type"}
end
