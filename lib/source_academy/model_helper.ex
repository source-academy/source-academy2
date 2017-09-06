defmodule SourceAcademy.ModelHelper do
  @moduledoc false
  alias Timex.Timezone

  def convert_date(params, field) do
    if params[field] != "" && params[field] != nil do
      timezone = Timezone.get("Asia/Singapore", Timex.now)
      date = params[field]
        |> String.to_integer
        |> Timex.from_unix(:millisecond)
        |> Timezone.convert(timezone)
      Map.put(params, field, date)
    else
      params
    end
  end
end
