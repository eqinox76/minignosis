import React from "react";
import { Chip, TextField } from "@material-ui/core";

class TagFieldProps {
  tags: string[];
  onAdd: (e: string) => void;
  onDelete: (e: string) => void;
}

export class TagField extends React.Component<TagFieldProps, { input: string }> {
  constructor(p: any) {
    super(p);
    this.state = {
      input: ""
    };
  }

  render() {
    return (
      <div>
        <TextField label="add tag"
                   value={this.state.input}
                   onChange={(e) => this.setState({input: e.target.value})}
                   onKeyDown={(event: any) => {
                     if (event.key === "Enter") {
                       this.props.onAdd(this.state.input);
                       this.setState({input: ""})
                     }
                   }}
        />
        <div>
          {
            this.props.tags?.map((name) => {
                return <Chip key={name}
                             size="small"
                             label={name}
                             onDelete={() => this.props.onDelete(name)}/>
              }
            )
          }
        </div>
      </div>
    );
  }
}
