import React, { useEffect, useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import ListItem from "../components/ListItem";
import { useReminderDAO } from "../db/reminderDAO";

const ReminderListItem = ({ item, navigation, renderRightActions }) => {
  const [count, setCount] = useState(0);
  const { countIncompleteRemindersByListId } = useReminderDAO();

  useEffect(() => {
    const fetchCount = async () => {
      const result = await countIncompleteRemindersByListId(item.id);
      setCount(result);
    };
    fetchCount();
  }, [item.id]);
  console.log("Count:", count);

  return (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <ListItem
        title={item.name}
        icon={item.icon}
        color={item.color}
        count={count}
        onPressReminders={() =>
          navigation.navigate("Reminders", { id: item.id, name: item.name })
        }
      />
    </Swipeable>
  );
};

export default ReminderListItem;
