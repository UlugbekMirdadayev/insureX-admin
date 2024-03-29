import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Trash } from "tabler-icons-react";
import { useSelector, useDispatch } from "react-redux";
import {
  LoadingOverlay,
  Header,
  MultiSelect,
  ActionIcon,
  Grid,
  Checkbox,
} from "@mantine/core";
import { _URL, getFormData } from "../utils";
import { PlusUser } from "../icons";
import { getAgents } from "../redux/reducer/agents";
import SearchComponent from "../ui/search";
import { getAgentsFC } from "../utils/request";

function Rows({ item, datas, isCompanys, isRegions, dispatch, user }) {
  const { register, handleSubmit } = useForm();
  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(item?.authentification);
  const [insurance_company_ids, setInsurance_company_ids] = React.useState(
    item?.insurance_company_ids
  );
  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    data.insurance_company_ids = insurance_company_ids;
    !data.region_id && (data.region_id = item.region_id);
    if (data?.id) {
      let formData = { ...data, role: "agent" };
      delete formData.id;
      setIsLoading(true);
      axios
        .patch(`${_URL}/agents/${item?.id}`, getFormData(formData))
        .then((res) => {
          setIsLoading(false);
          toast.success("Updated");
          setIsUpdated(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error("Error while updating data");
        });
    }
    if (!item.id) {
      setIsLoading(true);
      delete data?.new;
      delete data?.id;
      axios
        .post(`${_URL}/agents`, getFormData(data))
        .then((res) => {
          setIsLoading(false);
          toast.success("Data uploaded, new users created");
          setIsUpdated(false);
          getAgentsFC(dispatch, user, "/agents");
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error("Error loading data, please try again");
        });
    }
  };

  const patchAutification = (data) => {
    if (!item.id) return setIsChecked(false);
    const formData = {
      authentification: !isChecked,
    };
    setIsLoading(true);
    axios
      .patch(`${_URL}/agents/${item?.id}`, getFormData(formData))
      .then(({ data }) => {
        setIsLoading(false);
        setIsChecked(!isChecked);
        getAgentsFC(dispatch, user, "/agents");
      })
      .catch((err) => {
        setIsLoading(false);
        setIsChecked(isChecked);
        console.log(err);
      });
  };

  return (
    <>
      <form className="row" onSubmit={handleSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />
        <Checkbox
          type="checkbox"
          checked={isChecked}
          defaultValue={item?.authentification}
          onChange={patchAutification}
          className="checkbox_inp"
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.first_name}
          {...register(`first_name`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.second_name}
          {...register(`second_name`)}
        />

        <MultiSelect
          className="input-multi-select"
          placeholder="choose..."
          style={{
            width: "200px",
          }}
          defaultValue={item?.insurance_company_ids}
          onChange={(e) => {
            setIsUpdated(true);
            setInsurance_company_ids(e);
          }}
          data={isCompanys?.map((item) => ({
            value: item?.id,
            label: item?.title,
            custome_disabled:
              user.role === "insurance_company"
                ? item?.id !== user.insurance_company.id
                  ? "true"
                  : "false"
                : "",
          }))}
          transition="pop-top-left"
          transitionDuration={80}
          transitionTimingFunction="ease"
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.passport_id}
          readOnly={item?.new ? false : true}
          {...register(`passport_id`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.phone}
          type="tel"
          readOnly={item?.new ? false : true}
          {...register(`phone`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.email}
          type="email"
          {...register(`email`)}
        />
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.employee_number}
          {...register(`employee_number`)}
        />
        <select
          onInput={(e) => setIsUpdated(true)}
          value={
            isRegions?.filter((options) => options.id === item?.region_id)[0]
              ?.id
          }
          {...register(`region_id`)}
        >
          {isRegions?.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.region_name}
            </option>
          ))}
        </select>
        <input
          onInput={(e) => setIsUpdated(true)}
          defaultValue={item?.address}
          {...register(`address`)}
        />
        {isUpdated ? (
          <button type="submit" onClick={() => {}}>
            {item?.id ? "Update" : "Create"}
          </button>
        ) : (
          <div
            title="Удалить"
            type="button"
            className="delete"
            onClick={() => {
              if (!item?.id) {
                dispatch(getAgents(datas.filter((item) => item?.new !== true)));
              }
              if (item?.id) {
                setIsLoading(true);
                axios
                  .patch(
                    `${_URL}/agents/${item.id}`,
                    getFormData({
                      delete: true,
                    })
                  )
                  .then((res) => {
                    setIsLoading(false);
                    dispatch(
                      getAgents(datas.filter((__res) => __res?.id !== item?.id))
                    );
                    toast.success("Removed");
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                    toast.error("Error when deleting data");
                  });
              }
            }}
          >
            <ActionIcon color="red">
              <Trash size={16} />
            </ActionIcon>
          </div>
        )}
      </form>
    </>
  );
}

export default function Persons() {
  const dispatch = useDispatch();
  const agents = useSelector(({ agents }) => agents?.agents);
  const isCompanys = useSelector(
    ({ insuredCmp }) => insuredCmp?.insuredCompanies
  );
  const isRegions = useSelector(({ region }) => region?.region);
  const user = useSelector(({ user }) => user);
  const [elements, setElements] = React.useState([...agents]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");

  React.useEffect(() => setElements([...agents]), [agents]);

  return (
    <>
      <Header height={60} p="xs">
        <Grid align="center">
          <Grid.Col span={3}>
            <button
              className="adder"
              onClick={() => {
                if (elements.filter((item) => item?.new)?.length) {
                  toast.error(
                    "You cannot add new entries until you finish the previous one."
                  );
                } else {
                  dispatch(
                    getAgents(elements?.concat([{ new: true }])?.reverse())
                  );
                  toast.success("You can fill in a new entry");
                }
              }}
            >
              <span>Add </span>
              <PlusUser color={"#fff"} />
            </button>
          </Grid.Col>
          <Grid.Col span={3}>
            <SearchComponent
              data={elements?.filter((resp) =>
                !resp.delete && user?.role === "insurance_company"
                  ? user?.insurance_company?.id === resp?.insurance_company_id
                  : resp
              )}
              setFilteredData={setFilteredData}
              setInputText={setInputText}
              type={[
                "first_name",
                "second_name",
                "passport_id",
                "phone",
                "email",
                "employee_number",
              ]}
            />
          </Grid.Col>
        </Grid>
      </Header>
      <div
        className="ox-scroll"
        style={{ minHeight: "max-content", overflow: "hidden" }}
      >
        <div className="row">
          <input
            className="disabled"
            readOnly={true}
            value={"auth"}
            style={{ width: "50px" }}
          />
          <input className="disabled" readOnly={true} value={"first_name"} />
          <input className="disabled" readOnly={true} value={"last_name"} />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"insurance_company"}
          />
          <input className="disabled" readOnly={true} value={"passport_id"} />
          <input className="disabled" readOnly={true} value={"phone"} />
          <input className="disabled" readOnly={true} value={"email"} />
          <input
            className="disabled"
            readOnly={true}
            value={"employee_number"}
          />
          <input className="disabled" readOnly={true} value={"region"} />
          <input className="disabled" readOnly={true} value={"address"} />
          <input
            className="disabled"
            readOnly={true}
            value={"delete"}
            style={{ width: "66px" }}
          />
        </div>
      </div>
      <div
        className="ox-scroll"
        onScroll={(e) => {
          [...Array(document.querySelectorAll(".ox-scroll").length)].map(
            (_, i) =>
              (document.querySelectorAll(".ox-scroll")[i].scrollLeft =
                e.target.scrollLeft)
          );
        }}
      >
        {(inputText?.length ? filteredData : elements)
          .sort((a, b) => {
            if (a?.id > b?.id) return -1;
            if (a?.id < b?.id) return 1;
            return 0;
          })
          .sort(
            (a, b) => Number(b.authentification) - Number(a.authentification)
          )
          .map((item, i) => (
            <Rows
              key={item?.id ?? i}
              item={item}
              datas={elements}
              isCompanys={isCompanys}
              isRegions={isRegions}
              user={user}
              dispatch={dispatch}
            />
          ))}
      </div>
    </>
  );
}
