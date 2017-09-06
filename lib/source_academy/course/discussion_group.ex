defmodule SourceAcademy.Course.DiscussionGroup do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Course.Student
  alias SourceAcademy.Accounts.User

  schema "discussion_group" do
    belongs_to :student, Student
    belongs_to :staff, User

    timestamps()
  end

  def changeset(discussion_group, params \\ %{}) do
    discussion_group
    |> cast(params, [])
  end
end
