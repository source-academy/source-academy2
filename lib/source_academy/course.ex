defmodule SourceAcademy.Course do
  @moduledoc false

  import Ecto.Changeset
  import Ecto.Query
  import SourceAcademy.ContextHelper

  alias SourceAcademy.Repo
  alias SourceAcademy.Accounts
  alias SourceAcademy.Accounts.User
  alias SourceAcademy.Course.Achievement
  alias SourceAcademy.Course.Announcement
  alias SourceAcademy.Course.DiscussionGroup
  alias SourceAcademy.Course.Material
  alias SourceAcademy.Course.MaterialCategory
  alias SourceAcademy.Course.Student
  alias SourceAcademy.Course.StudentAchievement
  alias SourceAcademy.Course.XPHistory
  alias SourceAcademy.Course.Level

  def all_achievements, do: Repo.all(Achievement)

  def all_announcements, do: Repo.all(
    from a in Announcement,
    order_by: [desc: a.inserted_at],
    preload: [:poster]
  )

  def all_students, do: Repo.all(
    from s in Student,
    order_by: [desc: s.experience_point],
    where: s.is_phantom == false,
    preload: [:user]
  )

  def all_phantom_students, do: Repo.all(
    from s in Student,
    where: s.is_phantom == true,
    preload: [:user]
  )

  def all_discussion_groups, do: Repo.all(
    from u in DiscussionGroup,
    preload: [student: [:user], staff: []]
  )

  def all_material_categories, do: Repo.all(MaterialCategory)

  def all_materials, do: Repo.all(Material)

  def students_without_discussion_group(), do: Repo.all(
    from s in Student,
    left_join: dg in DiscussionGroup, on: dg.student_id == s.id,
    where: is_nil(dg.student_id) and not s.is_phantom,
    select: s,
    preload: [:user]
  )

  def materials_by_category() do
    Repo.all(
      from mc in MaterialCategory,
      left_join: material in Material, on: material.category_id == mc.id,
      preload: [materials: material]
    )
  end

  def build_achievement(params \\ %{}) do
    Achievement.changeset(%Achievement{}, params)
  end

  def build_announcement(params \\ %{}) do
    Announcement.changeset(%Announcement{}, params)
  end

  def build_discussion_group do
    DiscussionGroup.changeset(%DiscussionGroup{})
  end

  def build_material(params \\ %{}) do
    Material.changeset(%Material{}, params)
  end

  def build_material_category(params \\ %{}) do
    MaterialCategory.changeset(%MaterialCategory{}, params)
  end

  def build_student_achievement(params \\ %{}) do
    StudentAchievement.changeset(%StudentAchievement{}, params)
  end

  def build_xp_history(params \\ %{}) do
    XPHistory.changeset(%XPHistory{}, params)
  end

  def change_achievement(id, params) do
    achievement = Repo.get(Achievement, id)
    Achievement.changeset(achievement, params)
  end

  def create_student(user, is_phantom \\ false) do
    student = %Student{}
      |> Student.changeset(%{ is_phantom: is_phantom })
      |> put_assoc(:user, user)
    Repo.insert(student)
  end

  def create_discussion_group(staff_id, student_id) do
    staff = Accounts.get_user(staff_id)
    student = Repo.get(Student, student_id)
    changeset = %DiscussionGroup{}
      |> DiscussionGroup.changeset()
      |> put_assoc(:student, student)
      |> put_assoc(:staff, staff)
    Repo.insert(changeset)
  end

  def create_announcement(params, poster) do
    params
    |> build_announcement()
    |> put_assoc(:poster, poster)
    |> Repo.insert
  end

  def create_material(params, uploader, category_id) do
    category = Repo.get(MaterialCategory, category_id)
    params
    |> build_material()
    |> put_assoc(:uploader, uploader)
    |> put_assoc(:category, category)
    |> Repo.insert
  end

  def create_material_category(params) do
    params
    |> build_material_category()
    |> Repo.insert
  end

  def create_phantom_student(user), do: create_student(user, true)

  def create_achievement(params) do
    Repo.transaction fn ->
      changeset = params
        |> build_achievement()
        |> put_display_order(Repo.all(Achievement))
      case Repo.insert(changeset) do
        {:ok, achievement} -> achievement
        {:error, changeset} -> Repo.rollback(changeset)
      end
    end
  end

  def create_xp_history(params, student_id, giver_id) do
    Repo.transaction fn ->
      giver = Repo.get(User, giver_id)
      student = Repo.get(Student, student_id)
      changeset =
        %XPHistory{}
        |> XPHistory.changeset(params)
        |> put_assoc(:giver, giver)
        |> put_assoc(:student, student)
      case Repo.insert(changeset) do
        {:ok, xp_history} -> add_experience_point(student, xp_history.amount)
        {:error, changeset} -> Repo.rollback(changeset)
      end
    end
  end

  def add_experience_point(student_id, amount) when is_binary(student_id) do
    student = Repo.get(Student, student_id)
    add_experience_point(student, amount)
  end

  def add_experience_point(%Student{} = student, amount) do
    new_xp = student.experience_point + amount
    changeset = student
      |> change(%{ experience_point: new_xp, level: Level.from_xp(new_xp) })
    case Repo.update(changeset) do
      {:ok, student} -> student
      {:error, changeset} -> Repo.rollback(changeset)
    end
  end

  def change_announcement(id) do
    announcement = Repo.get(Announcement, id)
    Announcement.changeset(announcement, %{})
  end

  def discussion_group_students(staff) do
    Repo.all(
      from dg in DiscussionGroup,
        where: dg.staff_id == ^staff.id,
        select: dg,
        preload: [student: [:user]]
    )
    |> Enum.map(&(&1.student))
  end

  def update_announcement(id, params) do
    simple_update(Announcement, id,
      params: params, using: &Announcement.changeset/2)
  end

  def toggle_announcement_pinned(id) do
    toggle_field(Announcement, id, :is_pinned)
  end

  def toggle_announcement_published(id) do
    toggle_field(Announcement, id, :is_published)
  end

  def update_achievement(id, params) do
    simple_update(Achievement, id,
      params: params, using: &Achievement.changeset/2)
  end

  def get_student(%User{} = user) do
    Repo.one(
      from s in Student,
      where: s.user_id == ^user.id,
      preload: [:user]
    )
  end

  def get_student(id) do
    Repo.preload(Repo.get(Student, id), :user)
  end

  def get_student_staff(id) do
    Repo.one(
      from dg in DiscussionGroup,
      where: dg.student_id == ^id,
      join: u in User, on: u.id == dg.staff_id,
      select: u
    )
  end

  def get_student_xp_history(id) do
    Repo.all(
      from xp in XPHistory,
      where: xp.student_id == ^id,
      preload: [:giver]
    )
  end

  def move_achievement_up(id), do: update_display_order(Achievement, id, -1)
  def move_achievement_down(id), do: update_display_order(Achievement, id, 1)

  def grant_achievement(student_id, achievement_id) do
    Repo.transaction fn ->
      student = Repo.get(Student, student_id)
      achievement = Repo.get(Achievement, achievement_id)
      changeset =
        %StudentAchievement{}
        |> cast([], [])
        |> put_assoc(:student, student)
        |> put_assoc(:achievement, achievement)
      case Repo.insert(changeset) do
        {:ok, student_achievement} -> student_achievement
        {:error, changeset} -> Repo.rollback(changeset)
      end
    end
  end

  def toggle_phantom_status(student_id) when is_binary(student_id) do
    student = Repo.get(Student, student_id)
    toggle_phantom_status(student)
  end

  def toggle_phantom_status(student) do
    student
    |> change(%{is_phantom: !student.is_phantom})
    |> Repo.update!
  end

  def delete_material(id) do
    material = Repo.get!(Material, id)
    Repo.delete!(material)
  end

  def delete_material_category(id) do
    material_category = Repo.get!(MaterialCategory, id)
    Repo.delete!(material_category)
  end

  def delete_achievement(id) do
    achievement = Repo.get!(Achievement, id)
    Repo.delete!(achievement)
  end

  def delete_discussion_group(id) do
    discussion_group = Repo.get!(DiscussionGroup, id)
    Repo.delete!(discussion_group)
  end
end
