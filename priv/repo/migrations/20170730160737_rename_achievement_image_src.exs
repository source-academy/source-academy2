defmodule SourceAcademy.Repo.Migrations.RenameAchievementImageSrc do
  use Ecto.Migration

  def change do
    rename table(:achievements), :image_src, to: :image_url
  end
end
