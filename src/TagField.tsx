import React from "react";
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { Tags } from "./Firestore";
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';

class TagFieldProps {
  tags: string[];
  onAdd: (e: string) => void;
  onDelete: (e: string) => void;
}

export class TagField extends React.Component<TagFieldProps, { input: string, tags: string[], createDialog: boolean }> {
  constructor(p: any) {
    super(p);
    this.submit = this.submit.bind(this);
    this.state = {
      input: "",
      tags: undefined,
      createDialog: false,
    };
  }

  componentDidMount(): void {
    Tags.fromFirestore()
      .then((tags) => {
        if (this.props.tags !== undefined) {
          tags = tags.filter((t) => !this.props.tags.includes(t))
        }
        this.setState({ tags: tags })
      })
  }

  render() {
    if (this.state.tags === undefined) {
      return (<div>Loading ... </div>)
    }

    return (
      <div>
        <Autocomplete
          freeSolo
          disableClearable
          options={this.state.tags}
          inputValue={this.state.input}
          onInputChange={(_, value) => {
            this.setState({ input: value.toLowerCase() })
          }}
          onKeyDown={(event: any) => {
            if (event.key === "Enter") {
              // this timeout is necessary so that the confirm dialog is not acting on this enter event
              // https://github.com/mui-org/material-ui/issues/13770
              setTimeout(this.submit)
            }
          }}
          renderInput={(params) => (
            <Grid>
              <TextField {...params} label="add tag" />
              {
                this.state.tags.includes(this.state.input) ?
                  <IconButton aria-label="add tag"
                    onClick={this.submit}>
                    <AddIcon />
                  </IconButton>
                  :
                  <IconButton aria-label="create new tag"
                    onClick={this.submit}>
                    <CreateIcon />
                  </IconButton>
              }
            </Grid>
          )}
        />
        <div>
          {
            this.props.tags?.map((name) => {
              return <Chip key={name}
                size="small"
                label={name}
                onDelete={() => this.props.onDelete(name)} />
            }
            )
          }
        </div>
        <Dialog open={this.state.createDialog} onClose={() => {
          this.setState({ createDialog: false })
        }}>
          <DialogTitle>Add a new Tag</DialogTitle>
          <DialogContent>
            <Typography variant="caption" display="block">
              {this.state.input}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained"
              startIcon={<CancelIcon />}
              onClick={() => {
                this.setState({ createDialog: false })
              }}
              color="primary"
            />
            <Button autoFocus
              variant="contained"
              startIcon={<CreateIcon />}
              onClick={() => {
                Tags.addToFirestore(this.state.input)
                  .then(() => {
                    this.props.onAdd(this.state.input);
                    this.setState({ input: "", createDialog: false })
                  });
              }}
              color="primary"
            />
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  private async submit() {
    if (this.state.tags.includes(this.state.input)) {
      this.props.onAdd(this.state.input);
      this.setState({ input: "" });
    } else {
      this.setState({ createDialog: true });
    }
  }
}
