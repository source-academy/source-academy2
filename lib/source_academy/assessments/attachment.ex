defmodule SourceAcademy.Assessments.Attachment do
  @moduledoc false

  use Arc.Definition
  use Arc.Ecto.Definition
  def __storage, do: Arc.Storage.Local
end
