import React from "react";
import { LoadingOverlay, Header, ActionIcon } from "@mantine/core";
import axios from "axios";
import { _URL, getFormData } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";
import { useSelector } from "react-redux";
import { Trash } from "tabler-icons-react";

function Rows({ item, setElements, datas, loading }) {
  const { register, handleSubmit } = useForm();

  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(loading);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    if (data?.id) {
      let formData = {
        ...data,
        insurance_company_id: data.insurance_company_ids,
      };
      delete formData.id;
      delete formData.insurance_company_ids;
      setIsLoading(true);
      axios
        .patch(
          `${_URL}/insurance-companies/${item?.id}`,
          getFormData(formData),
          {
            headers: {
              Authorization: `"Bearer ${
                JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                  .token
              } `,
            },
          }
        )
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
      data.passport_id = data.ie_number;
      data.role = "insurance_company";
      axios
        .post(`${_URL}/insurance-companies`, getFormData(data), {
          headers: {
            Authorization: `"Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res?.data?.message?.insurance_company].filter(
              (item) => !item?.new
            )
          );
          toast.success("Data uploaded, new users created");
          setIsUpdated(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error("Error loading data, please try again");
        });
    }
  };

  return (
    <>
      <form className="row" onSubmit={handleSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />
        <input
          className="multiples-select"
          onInput={(e) => {
            setIsUpdated(true);
          }}
          defaultValue={item?.title}
          {...register(`title`)}
        />
        <input
          className="multiples-select"
          onInput={(e) => {
            setIsUpdated(true);
          }}
          defaultValue={item?.ie_number}
          {...register(`ie_number`)}
        />

        <input
          className="multiples-select"
          onInput={(e) => {
            e.target.value !== item?.email
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.email}
          type="email"
          {...register(`email`)}
        />
        <input
          className="multiples-select"
          onInput={(e) => {
            e.target.value !== item?.phone
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.phone}
          type="tel"
          {...register(`phone`)}
        />
        <input
          className="multiples-select"
          onInput={(e) => {
            e.target.value !== item?.address
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.address}
          {...register(`address`)}
        />
        {isUpdated ? (
          <button type="submit" onClick={() => {}}>
            {item?.id ? "Update" : "Create"}
          </button>
        ) : (
          <div
            title="??????????????"
            type="button"
            className="delete"
            onClick={() => {
              if (!item?.id) {
                setElements(datas.filter((item) => item?.new !== true));
              }
              if (item?.id) {
                setIsLoading(true);
                axios
                  .patch(
                    `${_URL}/insurance-companies/${item.id}`,
                    getFormData({
                      delete: true,
                    })
                  )
                  .then((res) => {
                    setIsLoading(false);
                    setElements(
                      datas.filter((__res) => __res?.id !== item?.id)
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
  const user = useSelector(({ user }) => user);
  const [elements, setElements] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user.role === "superadmin") {
      setLoading(true);
      const fetchData = async () => {
        await axios
          .get(`${_URL}/insurance-companies`, {
            headers: {
              Authorization: `"Bearer ${
                JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                  .token
              } `,
            },
          })
          .then((res) => {
            setElements(res?.data?.message?.insurance_companies);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      };
      fetchData();
    }
    if (user.role === "insurance_company") {
      setElements([user.insurance_company]);
    }
  }, []);

  return (
    <>
      <Header height={60} p="xs">
        {user.role === "superadmin" && (
          <button
            className="adder"
            onClick={() => {
              if (elements.filter((item) => item?.new)?.length) {
                toast.error(
                  "You cannot add new entries until you finish the previous one."
                );
              } else {
                setElements(elements?.concat([{ new: true }])?.reverse());
                toast.success("You can fill in a new entry");
              }
            }}
          >
            <span>Add</span>
            <PlusUser color={"#fff"} />
          </button>
        )}
      </Header>
      <div className="ox-scroll">
        <LoadingOverlay visible={loading} />
        <div className="row">
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"title"}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"ie_number"}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"email"}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"phone"}
          />
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"address"}
          />
        </div>
        {elements
          ?.filter((resp) => !resp.delete)
          .map((item, i) => (
            <Rows
              key={item?.id ?? i}
              item={item}
              setElements={setElements}
              datas={elements}
              loading={loading}
            />
          ))}
      </div>
    </>
  );
}
